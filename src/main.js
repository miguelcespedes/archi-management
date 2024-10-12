// src/main.js

import { Logger } from './utils/Logger.js';
import { App } from './core/App.js';
import { FileUploadHandler } from './ui/handlers/FileUploadHandler.js';

Ext.onReady(function() {
    Logger.info("[INFO] ExtJS está listo - Iniciando la aplicación");

    // Inicializar la aplicación y el layout
    const app = new App();
    app.init();

    // Obtener el layout de la aplicación
    const appLayout = app.getLayout();

    // Crear una instancia de FileUploadHandler
    const fileUploadHandler = new FileUploadHandler(appLayout);

    // Establecer un callback para manejar el contenido del archivo cargado
    appLayout.setFileLoadHandler(function(xmlContent) {
        Logger.info("[INFO] Archivo cargado, procesando contenido...");

        // Procesar el contenido del archivo utilizando FileUploadHandler
        fileUploadHandler.processFileContent(xmlContent);
    });
});
