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
            const isFolder = child.nodeName.toLowerCase() === 'folder';

            if (isFolder) {
                Logger.info(`[INFO] Parseando carpeta: ${child.getAttribute('name') || 'Carpeta sin nombre'}`);
                children.push({
                    text: child.getAttribute('name') || 'Carpeta sin nombre',
                    expanded: true,
                    children: TreeDataService.parseChildren(child),
                    id: child.getAttribute('id') || 'node-' + Math.random().toString(36).substr(2, 9),
                    leaf: false,
                    type: child.getAttribute('type') || 'folder'
                });
            } else {
                Logger.info(`[INFO] Parseando elemento: ${child.getAttribute('name') || 'Elemento sin nombre'}`);
                const documentation = child.querySelector('documentation') ? child.querySelector('documentation').textContent.trim() : null;
                const properties = Array.from(child.querySelectorAll('property')).map(prop => ({
                    key: prop.getAttribute('key'),
                    value: prop.getAttribute('value')
                }));
                const source = child.getAttribute('source');
                const target = child.getAttribute('target');
                children.push({
                    text: child.getAttribute('name') || 'Elemento sin nombre',
                    id: child.getAttribute('id') || 'node-' + Math.random().toString(36).substr(2, 9),
                    leaf: true,
                    documentation: documentation,
                    properties: properties,
                    type: child.getAttribute('xsi:type') || 'element',
                    source: source || null,
                    target: target || null
                });
            }
        });

        return children;
    }
}