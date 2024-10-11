// src/ui/handlers/FileUploadHandler.js

import { FileProcessor } from '../../services/FileProcessor.js';
import { Logger } from '../../utils/Logger.js';

export class FileUploadHandler {
    constructor(appLayout) {
        this.fileInput = document.getElementById('fileInput');
        this.initFileInputListener(appLayout);
    }

    initFileInputListener(appLayout) {
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    Logger.info(`[INFO] Archivo seleccionado: ${file.name}`);
                    FileProcessor.processFile(file, (xmlContent) => {
                        this.onFileLoadCallback(xmlContent);
                    });
                }
            });
        } else {
            Logger.error("[ERROR] No se encontró el elemento de entrada de archivo.");
        }
    }

    onFileLoad(callback) {
        this.onFileLoadCallback = callback;
    }
}