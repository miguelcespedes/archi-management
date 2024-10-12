// src/main.js

import { App } from './core/App.js';
import { Logger } from './utils/Logger.js';
import { TreeInteractionHandler } from './ui/handlers/TreeInteractionHandler.js';
import { FileUploadHandler } from './ui/handlers/FileUploadHandler.js';
import { DetailInteractionHandler } from './ui/handlers/DetailInteractionHandler.js';
import { TreeDataService } from './services/TreeDataService.js';

Ext.onReady(function () {
    Logger.info("[INFO] ExtJS está listo - Iniciando la aplicación");

    const app = new App();
    app.initialize();

    Logger.info("[INFO] Aplicación inicializada con éxito.");

    const appLayout = app.getLayout();

    if (!appLayout) {
        Logger.error("[ERROR] No se pudo obtener el layout de la aplicación.");
        return;
    }

    Logger.info("[INFO] Configurando los manejadores de la experiencia del usuario");

    // Inicializar FileUploadHandler
    const fileUploadHandler = new FileUploadHandler(appLayout);
    fileUploadHandler.setOnFileLoadCallback((xmlContent) => {
        Logger.info("[INFO] Cargando contenido del archivo...");
        const treeData = TreeDataService.parseAndTransformToTree(xmlContent);

        if (treeData) {
            const treePanel = appLayout.getTreePanel();
            if (treePanel) {
                treePanel.setRootNode(treeData);
                Logger.info("[INFO] Datos cargados al árbol exitosamente.");
            } else {
                Logger.error("[ERROR] No se pudo obtener el panel del árbol para actualizar.");
            }
        } else {
            Logger.error("[ERROR] No se pudo transformar el contenido del archivo XML.");
        }
    });

    Logger.info("[INFO] FileUploadHandler configurado con éxito.");

    // Inicializar TreeInteractionHandler
    const treePanel = appLayout.getTreePanel();
    if (treePanel) {
        new TreeInteractionHandler(treePanel);
    } else {
        Logger.error("[ERROR] TreePanel no encontrado o no es válido en TreeInteractionHandler.");
    }

    // Inicializar DetailInteractionHandler
    if (treePanel) {
        new DetailInteractionHandler(treePanel);
    } else {
        Logger.error("[ERROR] TreePanel no encontrado o no es válido en DetailInteractionHandler.");
    }
});
