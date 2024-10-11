// src/ui/components/TreeComponent.js

import { Logger } from '../../utils/Logger.js';

export class TreeComponent {
    constructor(appLayout) {
        this.treePanel = appLayout.getTreePanel();
    }

    updateTree(xmlContent) {
        Logger.info("[INFO] Actualizando la estructura del árbol con el contenido del archivo XML.");
        try {
            const parsedData = this.parseXMLContent(xmlContent);
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

    parseXMLContent(xmlContent) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');
        const rootElement = xmlDoc.documentElement;

        return {
            text: rootElement.getAttribute('name') || 'Modelo Completo',
            expanded: true,
            children: Array.from(rootElement.children).map((child) => this.parseElement(child))
        };
    }

    parseElement(element) {
        return {
            text: element.getAttribute('name') || 'Elemento sin nombre',
            id: element.getAttribute('id') || 'node-' + Math.random().toString(36).substr(2, 9),
            leaf: element.children.length === 0,
            children: Array.from(element.children).map((child) => this.parseElement(child))
        };
    }

    onNodeClick(callback) {
        this.treePanel.on('itemclick', (view, record) => {
            if (record.get('leaf')) {
                callback(record);
            }
        });
    }
}