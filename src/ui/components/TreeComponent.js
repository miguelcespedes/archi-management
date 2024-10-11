// src/ui/components/TreeComponent.js

import { Logger } from '../../utils/Logger.js';

export class TreeComponent {
    constructor(appLayout) {
        this.treePanel = appLayout.getTreePanel();
    }

    updateTree(parsedData) {
        Logger.info("[INFO] Actualizando la estructura del árbol con los datos parseados.");
        try {
            const rootNode = this.treePanel.getStore().getRootNode();
            if (rootNode) {
                rootNode.removeAll();
                rootNode.appendChild(parsedData);
                Logger.info("[INFO] Árbol actualizado correctamente.");
            } else {
                Logger.error("[ERROR] No se pudo obtener el nodo raíz del árbol.");
            }
        } catch (error) {
            Logger.error("[ERROR] Ocurrió un error al actualizar el árbol: " + error.message);
        }
    }

    onNodeClick(callback) {
        this.treePanel.on('itemclick', (view, record) => {
            if (record.get('leaf')) {
                callback(record);
            }
        });
    }
}
