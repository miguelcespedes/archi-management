// src/main.js

import { App } from './core/App.js';
import { FileUploadHandler } from './ui/handlers/FileUploadHandler.js';
import { TreeInteractionHandler } from './ui/handlers/TreeInteractionHandler.js';
import { DetailInteractionHandler } from './ui/handlers/DetailInteractionHandler.js';
import { Logger } from './utils/Logger.js';

Ext.onReady(function () {
    Logger.info("[INFO] ExtJS está listo - Iniciando la aplicación");

    // Inicializar la aplicación
    Logger.info("[INFO] Inicializando la instancia de la aplicación");
    const app = new App();
    app.initialize();

    // Obtener el layout de la aplicación
    Logger.info("[INFO] Obteniendo el layout de la aplicación");
    const appLayout = app.getLayout();

    if (appLayout) {
        Logger.info("[INFO] Layout de la aplicación obtenido con éxito");

        // Configurar los manejadores de experiencia del usuario
        Logger.info("[INFO] Configurando los manejadores de la experiencia del usuario");
        const fileUploadHandler = new FileUploadHandler(appLayout);
        const treeInteractionHandler = new TreeInteractionHandler(appLayout);
        const detailInteractionHandler = new DetailInteractionHandler(appLayout);

        // Configurar el flujo de la experiencia del usuario
        Logger.info("[INFO] Configurando el flujo de la experiencia del usuario para cargar el archivo");
        fileUploadHandler.onFileLoad((file) => {
            Logger.info(`[INFO] Archivo cargado: ${file.name}`);
            
            try {
                Logger.info("[INFO] Intentando actualizar el árbol con los datos del archivo");
                treeInteractionHandler.updateTree(file);
                Logger.info("[INFO] Árbol actualizado con los datos del archivo.");
            } catch (error) {
                Logger.error(`[ERROR] Fallo al actualizar el árbol: ${error.message}`);
            }

            Logger.info("[INFO] Configurando el manejador de clic para los nodos del árbol");
            treeInteractionHandler.onNodeClick((node) => {
                try {
                    Logger.info(`[INFO] Nodo seleccionado: ${node.get('text')}`);
                    detailInteractionHandler.updateDetail(node);
                    Logger.info("[INFO] Detalles del nodo actualizados.");
                } catch (error) {
                    Logger.error(`[ERROR] Fallo al actualizar los detalles del nodo: ${error.message}`);
                }
            });
        });
    } else {
        Logger.error("[ERROR] No se pudo obtener el layout de la aplicación.");
    }
});