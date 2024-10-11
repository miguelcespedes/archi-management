// src/services/TreeDataService.js

import { Logger } from '../utils/Logger.js';

export class TreeDataService {
    static parseAndTransformToTree(xmlContent) {
        Logger.info("[INFO] Parseando y transformando el contenido XML a estructura de árbol.");
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');
        const rootElement = xmlDoc.documentElement;

        if (!rootElement) {
            Logger.error("[ERROR] No se pudo obtener el elemento raíz del XML.");
            return null;
        }

        const transformedTree = {
            text: rootElement.getAttribute('name') || 'Modelo Completo',
            expanded: true,
            children: TreeDataService.parseChildren(rootElement)
        };

        Logger.info("[INFO] Transformación del contenido XML completada.");
        return transformedTree;
    }

    static parseChildren(element) {
        const children = [];

        Array.from(element.children).forEach((child) => {
            if (child.children.length > 0) {
                Logger.info(`[INFO] Parseando carpeta: ${child.getAttribute('name') || 'Carpeta sin nombre'}`);
                children.push({
                    text: child.getAttribute('name') || 'Carpeta sin nombre',
                    expanded: true,
                    children: TreeDataService.parseChildren(child),
                    id: child.getAttribute('id') || 'node-' + Math.random().toString(36).substr(2, 9),
                    leaf: false
                });
            } else {
                Logger.info(`[INFO] Parseando elemento: ${child.getAttribute('name') || 'Elemento sin nombre'}`);
                children.push({
                    text: child.getAttribute('name') || 'Elemento sin nombre',
                    id: child.getAttribute('id') || 'node-' + Math.random().toString(36).substr(2, 9),
                    leaf: true
                });
            }
        });

        return children;
    }
}