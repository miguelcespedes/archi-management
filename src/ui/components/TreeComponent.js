// src/ui/components/TreeComponent.js

import { TreeDataService } from '../../services/TreeDataService.js';
import { Logger } from '../../utils/Logger.js';

export class TreeComponent {
    constructor(appLayout) {
        this.treePanel = appLayout.getTreePanel();
    }

    updateTree(xmlContent) {
        Logger.info("[INFO] Actualizando la estructura del árbol.");
        const rootNode = TreeDataService.parseAndTransformToTree(xmlContent);

        if (!rootNode) {
            Logger.error("[ERROR] No se pudo actualizar el árbol con los datos proporcionados.");
            return;
        }

        const treeStoreRoot = this.treePanel.getStore().getRootNode();
        if (treeStoreRoot) {
            treeStoreRoot.removeAll();
            treeStoreRoot.appendChild(rootNode);
        } else {
            Logger.error("[ERROR] No se pudo obtener el nodo raíz del árbol.");
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