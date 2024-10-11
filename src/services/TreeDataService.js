// src/services/TreeDataService.js

import { XMLParser } from '../domain/XMLParser.js';
import { Logger } from '../utils/Logger.js';

export class TreeDataService {
    static parseAndTransformToTree(xmlContent) {
        Logger.info("[INFO] Iniciando el parseo del contenido XML para la estructura del árbol.");
        const rootNode = XMLParser.parse(xmlContent);

        if (!rootNode) {
            Logger.error("[ERROR] No se pudo obtener el nodo raíz del XML.");
            return null;
        }

        return TreeDataService.transformToTreeFormat(rootNode);
    }

    static transformToTreeFormat(node) {
        const treeNode = {
            text: node.name,
            id: node.id,
            type: node.type,
            expanded: true,
            children: node.children.map(child => TreeDataService.transformToTreeFormat(child)),
            leaf: node.isLeaf()
        };

        return treeNode;
    }
}