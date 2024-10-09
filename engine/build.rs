use static_files::NpmBuild;

fn main() -> std::io::Result<()> {
    if !cfg!(debug_assertions) && cfg!(feature = "embed_frontend") {
        NpmBuild::new("../frontend")
            .install()?
            .run("generate")?
            .target("../frontend/.output/public")
            .change_detection()
            .to_resource_dir()
            .build()
    } else {
        Ok(())
    }
}
