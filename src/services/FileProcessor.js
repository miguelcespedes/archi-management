// src/services/FileProcessor.js

import { Logger } from '../utils/Logger.js';

export class FileProcessor {
    static processFile(file, callback) {
        const reader = new FileReader();

        reader.onload = (event) => {
            const xmlContent = event.target.result;
            Logger.info("[INFO] Lectura de archivo completada.");
            callback(xmlContent);
        };

        reader.onerror = (event) => {
            Logger.error("[ERROR] No se pudo leer el archivo: " + event.target.error.name);
        };

        reader.readAsText(file);
    }
}