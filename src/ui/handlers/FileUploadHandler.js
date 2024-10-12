// src/ui/handlers/FileUploadHandler.js

import { Logger } from '../../utils/Logger.js';

export class FileUploadHandler {
    constructor(appLayout) {
        const fileInputField = appLayout.getFileInputField();
        if (!fileInputField || typeof fileInputField.on !== 'function') {
            Logger.error("[ERROR] No se encontró el campo de entrada de archivo o no es válido.");
            return;
        }

        this.fileInputField = fileInputField;
        this.initListeners();
    }

    initListeners() {
        Logger.info("[INFO] Configurando el listener para la carga de archivos.");
        this.fileInputField.on('change', this.onFileChange.bind(this));
    }

    onFileChange(field, value) {
        const file = field.fileInputEl.dom.files[0];
        if (!file) {
            Logger.warn("[WARN] No se seleccionó ningún archivo.");
            return;
        }

        Logger.info(`[INFO] Archivo seleccionado: ${file.name}`);
        const reader = new FileReader();
        reader.onload = (e) => {
            Logger.info("[INFO] Cargando contenido del archivo...");
            const xmlContent = e.target.result;
            this.onFileLoad(xmlContent);
        };
        reader.readAsText(file);
    }

    setOnFileLoadCallback(callback) {
        this.onFileLoad = callback;
        Logger.info("[INFO] Callback onFileLoad configurado con éxito.");
    }
}
