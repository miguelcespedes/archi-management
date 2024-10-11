// src/core/App.js

import { AppLayout } from './AppLayout.js';
import { Logger } from '../utils/Logger.js';

export class App {
    constructor() {
        this.layout = null;
    }

    initialize() {
        Logger.info("[INFO] Inicializando la aplicación...");
        this.layout = new AppLayout();
        this.layout.initialize();
        this.layout.setFileLoadHandler(this.onFileLoad.bind(this));
        Logger.info("[INFO] Aplicación inicializada con éxito.");
    }

    onFileLoad(file) {
        Logger.info(`[INFO] Archivo cargado: ${file.name}`);
        // Aquí puedes continuar con el procesamiento del archivo
    }

    getLayout() {
        return this.layout;
    }
}