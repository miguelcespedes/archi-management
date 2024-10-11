// src/ui/handlers/TreeInteractionHandler.js

import { TreeComponent } from '../components/TreeComponent.js';
import { Logger } from '../../utils/Logger.js';

export class TreeInteractionHandler {
    constructor(appLayout) {
        this.treeComponent = new TreeComponent(appLayout);
    }

    updateTree(xmlContent) {
        Logger.info("[INFO] Actualizando la estructura del árbol con el contenido del archivo XML.");
        this.treeComponent.updateTree(xmlContent);
    }

    onNodeClick(callback) {
        this.treeComponent.onNodeClick(callback);
    }
}