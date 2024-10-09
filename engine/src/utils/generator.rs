/// Simple Playlist Generator
///
/// You can call ffplayout[.exe] -g YYYY-mm-dd - YYYY-mm-dd to generate JSON playlists.
///
/// The generator takes the files from storage, which are set in config.
/// It also respect the shuffle/sort mode.
use std::{
    fs::{create_dir_all, write},
    io::Error,
};

use chrono::Timelike;
use lexical_sort::{natural_lexical_cmp, StringSort};
use log::*;
use rand::{seq::SliceRandom, thread_rng, Rng};
use walkdir::WalkDir;

use crate::player::{
    controller::ChannelManager,
    utils::{
        folder::{fill_filler_list, FolderSource},
        get_date_range, include_file_extension,
        json_serializer::JsonPlaylist,
        sum_durations, Media,
    },
};
use crate::utils::{
    config::{PlayoutConfig, Template},
    logging::Target,
    time_to_sec,
};

pub fn random_list(clip_list: Vec<Media>, total_length: f64) -> Vec<Media> {
    let mut max_attempts = 10000;
    let mut randomized_clip_list: Vec<Media> = vec![];
    let mut target_duration = 0.0;
    let clip_list_length = clip_list.len();
    let usage_limit = (total_length / sum_durations(&clip_list)).floor() + 1.0;
    let mut last_clip = Media::new(0, "", false);

    while target_duration < total_length && max_attempts > 0 {
        let index = rand::thread_rng().gen_range(0..clip_list_length);
        let selected_clip = clip_list[index].clone();
        let selected_clip_count = randomized_clip_list
            .iter()
            .filter(|&n| *n == selected_clip)
            .count() as f64;

        if selected_clip_count == usage_limit
            || last_clip == selected_clip
            || target_duration + selected_clip.duration > total_length
        {
            max_attempts -= 1;
            continue;
        }

        target_duration += selected_clip.duration;
        randomized_clip_list.push(selected_clip.clone());
        max_attempts -= 1;
        last_clip = selected_clip;
    }

    randomized_clip_list
}

pub fn ordered_list(clip_list: Vec<Media>, total_length: f64) -> Vec<Media> {
    let mut index = 0;
    let mut skip_count = 0;
    let mut ordered_clip_list: Vec<Media> = vec![];
    let mut target_duration = 0.0;
    let clip_list_length = clip_list.len();

    while target_duration < total_length && skip_count < clip_list_length {
        if index == clip_list_length {
            index = 0;
        }

        let selected_clip = clip_list[index].clone();

        if sum_durations(&ordered_clip_list) + selected_clip.duration > total_length
            || (!ordered_clip_list.is_empty()
                && selected_clip == ordered_clip_list[ordered_clip_list.len() - 1])
        {
            skip_count += 1;
            index += 1;
            continue;
        }

        target_duration += selected_clip.duration;
        ordered_clip_list.push(selected_clip);
        index += 1;
    }

    ordered_clip_list
}

pub fn filler_list(config: &PlayoutConfig, total_length: f64) -> Vec<Media> {
    let filler_list = fill_filler_list(config, None);
    let mut index = 0;
    let mut filler_clip_list: Vec<Media> = vec![];
    let mut target_duration = 0.0;
    let clip_list_length = filler_list.len();

    if clip_list_length > 0 {
        while target_duration < total_length {
            if index == clip_list_length {
                index = 0;
            }

            let selected_clip = filler_list[index].clone();

            target_duration += selected_clip.duration;
            filler_clip_list.push(selected_clip);
            index += 1;
        }

        let over_length = target_duration - total_length;
        let last_index = filler_clip_list.len() - 1;

        filler_clip_list[last_index].out = filler_clip_list[last_index].duration - over_length;
    }

    filler_clip_list
}

pub fn generate_from_template(
    config: &PlayoutConfig,
    manager: &ChannelManager,
    template: Template,
) -> FolderSource {
    let mut media_list = vec![];
    let mut rng = thread_rng();
    let mut index: usize = 0;
    let id = config.general.channel_id;

    for source in template.sources {
        let mut source_list = vec![];
        let duration = (source.duration.hour() as f64 * 3600.0)
            + (source.duration.minute() as f64 * 60.0)
            + source.duration.second() as f64;

        debug!(target: Target::all(), channel = id; "Generating playlist block with <yellow>{duration:.2}</> seconds length");

        for path in source.paths {
            debug!("Search files in <b><magenta>{path:?}</></b>");

            let mut file_list = WalkDir::new(path.clone())
                .into_iter()
                .flat_map(|e| e.ok())
                .filter(|f| f.path().is_file())
                .filter(|f| include_file_extension(config, f.path()))
                .map(|p| p.path().to_string_lossy().to_string())
                .collect::<Vec<String>>();

            if !source.shuffle {
                file_list.string_sort_unstable(natural_lexical_cmp);
            }

            for entry in file_list {
                let media = Media::new(0, &entry, true);
                source_list.push(media);
            }
        }

        let mut timed_list = if source.shuffle {
            source_list.shuffle(&mut rng);

            random_list(source_list, duration)
        } else {
            ordered_list(source_list, duration)
        };

        let total_length = sum_durations(&timed_list);

        if duration > total_length {
            let mut filler = filler_list(config, duration - total_length);

            timed_list.append(&mut filler);
        }

        media_list.append(&mut timed_list);
    }

    for item in media_list.iter_mut() {
        item.index = Some(index);

        index += 1;
    }

    FolderSource::from_list(manager, media_list)
}

/// Generate playlists
pub fn playlist_generator(manager: &ChannelManager) -> Result<Vec<JsonPlaylist>, Error> {
    let config = manager.config.lock().unwrap().clone();
    let id = config.general.channel_id;
    let channel_name = manager.channel.lock().unwrap().name.clone();

    let total_length = match config.playlist.length_sec {
        Some(length) => length,
        None => {
            if config.playlist.length.contains(':') {
                time_to_sec(&config.playlist.length)
            } else {
                86400.0
            }
        }
    };
    let playlist_root = &config.channel.playlists;
    let mut playlists = vec![];
    let mut date_range = vec![];
    let mut from_template = false;

    if !playlist_root.is_dir() {
        error!(
            target: Target::all(), channel = id;
            "Playlist folder <b><magenta>{:?}</></b> not exists!",
            config.channel.playlists
        );
    }

    if let Some(range) = config.general.generate.clone() {
        date_range = range;
    }

    if date_range.contains(&"-".to_string()) && date_range.len() == 3 {
        date_range = get_date_range(id, &date_range)
    }

    // gives an iterator with infinit length
    let folder_iter = if let Some(template) = &config.general.template {
        from_template = true;

        generate_from_template(&config, manager, template.clone())
    } else {
        FolderSource::new(&config, manager.clone())
    };

    let list_length = manager.current_list.lock().unwrap().len();

    for date in date_range {
        let d: Vec<&str> = date.split('-').collect();
        let year = d[0];
        let month = d[1];
        let playlist_path = playlist_root.join(year).join(month);
        let playlist_file = &playlist_path.join(format!("{date}.json"));
        let mut length = 0.0;
        let mut round = 0;

        create_dir_all(playlist_path)?;

        if playlist_file.is_file() {
            warn!(
                target: Target::all(), channel = id;
                "Playlist exists, skip: <b><magenta>{}</></b>",
                playlist_file.display()
            );

            continue;
        }

        info!(
            target: Target::all(), channel = id;
            "Generate playlist: <b><magenta>{}</></b>",
            playlist_file.display()
        );

        let mut playlist = JsonPlaylist {
            channel: channel_name.clone(),
            date,
            path: None,
            start_sec: None,
            length: None,
            modified: None,
            program: vec![],
        };

        if from_template {
            let media_list = manager.current_list.lock().unwrap();
            playlist.program = media_list.to_vec();
        } else {
            for item in folder_iter.clone() {
                let duration = item.duration;

                if total_length >= length + duration {
                    playlist.program.push(item);

                    length += duration;
                } else if round == list_length - 1 {
                    break;
                } else {
                    round += 1;
                }
            }

            let list_duration = sum_durations(&playlist.program);

            if config.playlist.length_sec.unwrap() > list_duration {
                let time_left = config.playlist.length_sec.unwrap() - list_duration;
                let mut fillers = filler_list(&config, time_left);

                playlist.program.append(&mut fillers);
            }
        }

        let json: String = serde_json::to_string_pretty(&playlist)?;
        write(playlist_file, json)?;

        playlists.push(playlist);
    }

    Ok(playlists)
}
