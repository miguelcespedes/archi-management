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
        Logger.info("[INFO] Aplicación inicializada con éxito.");
    }

    getLayout() {
        return this.layout;
    }
}
