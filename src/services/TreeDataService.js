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
            children: TreeDataService.processFolders(rootElement)
        };

        Logger.info("[INFO] Transformación del contenido XML completada.");
        return transformedTree;
    }

    static processFolders(element) {
        const children = [];

        Array.from(element.children).forEach((child) => {
            if (child.nodeName.toLowerCase() === 'folder') {
                Logger.info(`[INFO] Parseando carpeta: ${child.getAttribute('name') || 'Carpeta sin nombre'}`);
                children.push({
                    text: child.getAttribute('name') || 'Carpeta sin nombre',
                    expanded: false,
                    children: TreeDataService.processFolders(child),
                    id: child.getAttribute('id') || 'node-' + Math.random().toString(36).substr(2, 9),
                    leaf: false,
                    type: child.getAttribute('type') || 'folder'
                });
            } else {
                Logger.info(`[INFO] Parseando elemento: ${child.getAttribute('name') || 'Elemento sin nombre'}`);
                const attributes = Array.from(child.attributes).reduce((acc, attr) => {
                    acc[attr.name] = attr.value;
                    return acc;
                }, {});
                const documentation = child.querySelector('documentation') ? child.querySelector('documentation').textContent.trim() : null;
                const properties = Array.from(child.querySelectorAll('property')).map(prop => ({
                    key: prop.getAttribute('key'),
                    value: prop.getAttribute('value')
                }));
                const source = child.getAttribute('source');
                const target = child.getAttribute('target');
                children.push({
                    text: child.getAttribute('name') || child.nodeName,
                    id: child.getAttribute('id') || 'node-' + Math.random().toString(36).substr(2, 9),
                    leaf: true,
                    data: {
                        tagName: child.nodeName,
                        attributes: attributes,
                        documentation: documentation,
                        properties: properties,
                        source: source || null,
                        target: target || null
                    }
                });
            }
        });

        return children;
    }
}
