// src/ui/handlers/FileUploadHandler.js

import { Logger } from '../../utils/Logger.js';

export class FileUploadHandler {
    constructor(appLayout) {
        this.fileField = appLayout.toolbar.down('filefield');
        this.initFileFieldListener();
    }

    initFileFieldListener() {
        if (this.fileField) {
            this.fileField.on('change', (field, value) => {
                const file = field.fileInputEl.dom.files[0];
                if (file) {
                    Logger.info(`[INFO] Archivo seleccionado: ${file.name}`);
                    this.onFileLoadCallback(file);
                    field.reset(); // Reiniciar el campo de archivo para permitir cargar el mismo archivo nuevamente
                }
            });
        } else {
            Logger.error("[ERROR] No se encontró el componente de entrada de archivo.");
        }
    }

    onFileLoad(callback) {
        this.onFileLoadCallback = callback;
    }
}
