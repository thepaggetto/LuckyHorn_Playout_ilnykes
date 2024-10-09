use std::{fs, path::PathBuf};

use log::*;

use crate::player::controller::ChannelManager;
use crate::player::utils::{json_reader, json_writer, JsonPlaylist};
use crate::utils::{
    config::PlayoutConfig, errors::ServiceError, files::norm_abs_path,
    generator::playlist_generator,
};

pub async fn read_playlist(
    config: &PlayoutConfig,
    date: String,
) -> Result<JsonPlaylist, ServiceError> {
    let d: Vec<&str> = date.split('-').collect();
    let mut playlist_path = config.channel.playlists.clone();

    playlist_path = playlist_path
        .join(d[0])
        .join(d[1])
        .join(date.clone())
        .with_extension("json");

    match json_reader(&playlist_path) {
        Ok(p) => Ok(p),
        Err(e) => Err(ServiceError::NoContent(e.to_string())),
    }
}

pub async fn write_playlist(
    config: &PlayoutConfig,
    json_data: JsonPlaylist,
) -> Result<String, ServiceError> {
    let date = json_data.date.clone();
    let d: Vec<&str> = date.split('-').collect();
    let mut playlist_path = config.channel.playlists.clone();

    if !playlist_path
        .extension()
        .and_then(|ext| ext.to_str())
        .map(|ext| ext.eq_ignore_ascii_case("json"))
        .unwrap_or(false)
    {
        playlist_path = playlist_path
            .join(d[0])
            .join(d[1])
            .join(date.clone())
            .with_extension("json");
    }

    let mut file_exists = false;

    if let Some(p) = playlist_path.parent() {
        fs::create_dir_all(p)?;
    }

    if playlist_path.is_file() {
        file_exists = true;
        if let Ok(existing_data) = json_reader(&playlist_path) {
            if json_data == existing_data {
                return Err(ServiceError::Conflict(format!(
                    "Playlist from {date}, already exists!"
                )));
            }
        }
    }

    match json_writer(&playlist_path, json_data) {
        Ok(_) => {
            let mut msg = format!("Write playlist from {date} success!");

            if file_exists {
                msg = format!("Update playlist from {date} success!");
            }

            return Ok(msg);
        }
        Err(e) => {
            error!("{e}");
        }
    }

    Err(ServiceError::InternalServerError)
}

pub fn generate_playlist(manager: ChannelManager) -> Result<JsonPlaylist, ServiceError> {
    let mut config = manager.config.lock().unwrap();

    if let Some(mut template) = config.general.template.take() {
        for source in template.sources.iter_mut() {
            let mut paths = vec![];

            for path in &source.paths {
                let (safe_path, _, _) =
                    norm_abs_path(&config.channel.storage, &path.to_string_lossy())?;
                paths.push(safe_path);
            }

            source.paths = paths;
        }

        config.general.template = Some(template);
    }

    drop(config);

    match playlist_generator(&manager) {
        Ok(playlists) => {
            if !playlists.is_empty() {
                Ok(playlists[0].clone())
            } else {
                Err(ServiceError::Conflict(
                    "The playlist could not be written, maybe it already exists!".into(),
                ))
            }
        }
        Err(e) => {
            error!("{e}");
            Err(ServiceError::InternalServerError)
        }
    }
}

pub async fn delete_playlist(config: &PlayoutConfig, date: &str) -> Result<String, ServiceError> {
    let d: Vec<&str> = date.split('-').collect();
    let mut playlist_path = PathBuf::from(&config.channel.playlists);

    playlist_path = playlist_path
        .join(d[0])
        .join(d[1])
        .join(date)
        .with_extension("json");

    if playlist_path.is_file() {
        match fs::remove_file(playlist_path) {
            Ok(_) => Ok(format!("Delete playlist from {date} success!")),
            Err(e) => {
                error!("{e}");
                Err(ServiceError::InternalServerError)
            }
        }
    } else {
        Ok(format!("No playlist to delete on: {date}"))
    }
}
