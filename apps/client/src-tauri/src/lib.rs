#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![/** 여기에 추후 커맨드 핸들러 추가 시 핸들러를 삽입해야 함 */])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
