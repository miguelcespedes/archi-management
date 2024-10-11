// src/ui/handlers/TreeInteractionHandler.js

import { TreeComponent } from '../components/TreeComponent.js';
import { Logger } from '../../utils/Logger.js';
import { FileProcessor } from '../../services/FileProcessor.js';
import { TreeDataService } from '../../services/TreeDataService.js';

export class TreeInteractionHandler {
    constructor(appLayout) {
        this.treeComponent = new TreeComponent(appLayout);
    }

    updateTree(file) {
        Logger.info("[INFO] Procesando el archivo XML para actualizar el árbol.");
        FileProcessor.processFile(file, (xmlContent) => {
            if (!xmlContent) {
                Logger.error("[ERROR] El contenido del archivo XML está vacío o no se pudo leer correctamente.");
                return;
            }
            Logger.info("[INFO] Archivo XML procesado exitosamente.");

            const rootNode = TreeDataService.parseAndTransformToTree(xmlContent);
            if (rootNode) {
                Logger.info("[INFO] Actualizando la estructura del árbol con los nodos obtenidos.");
                this.treeComponent.updateTree(rootNode);
            } else {
                Logger.error("[ERROR] No se pudo obtener la estructura del árbol a partir del archivo.");
            }
        });
    }

    onNodeClick(callback) {
        this.treeComponent.onNodeClick(callback);
    }
}
