use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .setup(|app| {
            if let Err(e) = migrate_legacy_data(app) {
                eprintln!("legacy data migration failed: {e}");
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn migrate_legacy_data(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let new_dir = app.path().app_config_dir()?;
    let new_db = new_dir.join("investment-tracker.db");
    if new_db.exists() {
        return Ok(());
    }
    let parent = new_dir
        .parent()
        .ok_or("could not resolve parent of app config dir")?;
    let old_dir = parent.join("com.casinotracker.app");
    let old_db = old_dir.join("casino-tracker.db");
    if !old_db.exists() {
        return Ok(());
    }
    std::fs::create_dir_all(&new_dir)?;
    std::fs::copy(&old_db, &new_db)?;
    for ext in ["-wal", "-shm"] {
        let old_aux = old_dir.join(format!("casino-tracker.db{ext}"));
        if old_aux.exists() {
            std::fs::copy(&old_aux, new_dir.join(format!("investment-tracker.db{ext}")))?;
        }
    }
    Ok(())
}
