// src/main.js

import { App } from './core/App.js';
import { FileUploadHandler } from './ui/handlers/FileUploadHandler.js';
import { TreeInteractionHandler } from './ui/handlers/TreeInteractionHandler.js';
import { DetailInteractionHandler } from './ui/handlers/DetailInteractionHandler.js';
import { Logger } from './utils/Logger.js';

Ext.onReady(function () {
    Logger.info("[INFO] ExtJS está listo - Iniciando la aplicación");

    // Inicializar la aplicación
    const app = new App();
    app.initialize();

    // Esperar a que el layout esté completamente inicializado antes de continuar
    const appLayout = app.getLayout();

    if (appLayout) {
        // Configurar los manejadores de experiencia del usuario
        const fileUploadHandler = new FileUploadHandler(appLayout);
        const treeInteractionHandler = new TreeInteractionHandler(appLayout);
        const detailInteractionHandler = new DetailInteractionHandler(appLayout);

        // Configurar el flujo de la experiencia del usuario
        fileUploadHandler.onFileLoad((xmlContent) => {
            treeInteractionHandler.updateTree(xmlContent);

            treeInteractionHandler.onNodeClick((node) => {
                detailInteractionHandler.updateDetail(node);
            });
        });
    } else {
        Logger.error("[ERROR] No se pudo obtener el layout de la aplicación.");
    }
});