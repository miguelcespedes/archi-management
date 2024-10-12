// src/ui/handlers/DetailInteractionHandler.js

import { Logger } from '../../utils/Logger.js';

export class DetailInteractionHandler {
    constructor(treePanel) {
        if (!treePanel || typeof treePanel.on !== 'function') {
            Logger.error("[ERROR] TreePanel no encontrado o no es válido en DetailInteractionHandler.");
            return;
        }
        this.treePanel = treePanel;
        this.initListeners();
    }

    initListeners() {
        Logger.info("[INFO] Configurando el listener para la selección de nodos del árbol.");
        this.treePanel.on('itemclick', this.onItemClick.bind(this));
    }

    onItemClick(view, record) {
        Logger.info(`[INFO] Nodo seleccionado: ${record.get('text')}`);
        const elementData = record.get('data');
        if (!elementData) {
            Logger.warn("[WARN] No se encontraron datos para el nodo seleccionado.");
            return;
        }

        this.displayDetails(elementData, record.get('text'));
    }

    displayDetails(elementData, tagName) {
        Logger.info(`[INFO] Mostrando detalles para el elemento: ${tagName}`);
        const detailsPanel = Ext.getCmp('detailsPanel');
        let detailsHtml = '<table style="width: 100%; border-collapse: collapse;">';
        detailsHtml += '<thead><tr><th style="border: 1px solid black; padding: 8px;">Propiedad</th><th style="border: 1px solid black; padding: 8px;">Valor</th></tr></thead><tbody>';

        const properties = elementData.attributes ? Object.keys(elementData.attributes) : [];
        for (let prop of properties) {
            detailsHtml += `<tr><td style="border: 1px solid black; padding: 8px;">${prop}</td><td style="border: 1px solid black; padding: 8px;">${elementData.attributes[prop] || '-'}</td></tr>`;
        }

        detailsHtml += '</tbody></table>';
        detailsHtml += `<h3>Contenido HTML del elemento ${tagName}:</h3>`;
        detailsHtml += `<div style="border: 1px solid black; padding: 10px; margin-top: 10px;">${Ext.htmlEncode(elementData.documentation || '')}</div>`;
        detailsPanel.update(detailsHtml);
    }
}
