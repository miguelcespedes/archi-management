// src/domain/XMLParser.js

import { Node } from './Node.js';

export class XMLParser {
    static parse(xmlContent) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

        if (!xmlDoc) {
            console.error("[ERROR] No se pudo parsear el XML.");
            return null;
        }

        const rootElement = xmlDoc.documentElement;
        const rootNode = new Node(
            rootElement.getAttribute('id') || 'root',
            rootElement.getAttribute('name') || 'Modelo Completo',
            rootElement.tagName
        );

        XMLParser.parseChildren(rootElement, rootNode);

        return rootNode;
    }

    static parseChildren(xmlElement, parentNode) {
        for (let child of xmlElement.children) {
            const childNode = new Node(
                child.getAttribute('id') || 'node-' + Math.random().toString(36).substr(2, 9),
                child.getAttribute('name') || 'Elemento sin nombre',
                child.tagName
            );

            parentNode.addChild(childNode);
            XMLParser.parseChildren(child, childNode);
        }
    }
}