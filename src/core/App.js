// src/core/App.js

import { Logger } from '../utils/Logger.js';
import { AppLayout } from './AppLayout.js';

export class App {
    constructor() {
        this.appLayout = null;
    }

    init() {
        Logger.info("[INFO] Inicializando la aplicación...");
        this.initLayout();
        Logger.info("[INFO] Aplicación inicializada con éxito.");
    }

    initLayout() {
        this.appLayout = new AppLayout();
        this.appLayout.initialize();
    }

    getLayout() {
        Logger.info("[INFO] Obteniendo el layout de la aplicación");
        return this.appLayout;
    }
}
