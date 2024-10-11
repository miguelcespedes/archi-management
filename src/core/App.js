// src/core/App.js

import { AppLayout } from './AppLayout.js';
import { Logger } from '../utils/Logger.js';
import { TreeInteractionHandler } from '../ui/handlers/TreeInteractionHandler.js';
import { DetailInteractionHandler } from '../ui/handlers/DetailInteractionHandler.js';

export class App {
    constructor() {
        this.layout = null;
        this.treeInteractionHandler = null;
        this.detailInteractionHandler = null;
    }

    initialize() {
        Logger.info("[INFO] Inicializando la aplicación...");
        this.layout = new AppLayout();
        this.layout.initialize();
        this.layout.setFileLoadHandler(this.onFileLoad.bind(this));
        Logger.info("[INFO] Aplicación inicializada con éxito.");

        // Inicializar los manejadores de interacción del árbol y detalles
        this.treeInteractionHandler = new TreeInteractionHandler(this.layout);
        this.detailInteractionHandler = new DetailInteractionHandler(this.layout);
    }

    onFileLoad(file) {
        Logger.info(`[INFO] Archivo cargado: ${file.name}`);
        try {
            Logger.info("[INFO] Intentando actualizar el árbol con los datos del archivo");
            this.treeInteractionHandler.updateTree(file);
            Logger.info("[INFO] Árbol actualizado con los datos del archivo.");

            // Configurar el manejador de clic para los nodos del árbol
            Logger.info("[INFO] Configurando el manejador de clic para los nodos del árbol");
            this.treeInteractionHandler.onNodeClick((node) => {
                try {
                    Logger.info(`[INFO] Nodo seleccionado: ${node.get('text')}`);
                    this.detailInteractionHandler.updateDetail(node);
                    Logger.info("[INFO] Detalles del nodo actualizados.");
                } catch (error) {
                    Logger.error(`[ERROR] Fallo al actualizar los detalles del nodo: ${error.message}`);
                }
            });
        } catch (error) {
            Logger.error(`[ERROR] Fallo al actualizar el árbol: ${error.message}`);
        }
    }

    getLayout() {
        return this.layout;
    }
}