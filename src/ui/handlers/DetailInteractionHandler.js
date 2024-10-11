// src/ui/handlers/DetailInteractionHandler.js

import { DetailPanel } from '../components/DetailPanel.js';
import { Logger } from '../../utils/Logger.js';

export class DetailInteractionHandler {
    constructor(appLayout) {
        this.detailPanel = new DetailPanel(appLayout);
    }

    updateDetail(node) {
        Logger.info(`[INFO] Actualizando el panel de detalles para el nodo: ${node.get('text')}`);
        const xmlContent = node.raw.element;
        this.detailPanel.updateContent(xmlContent);
    }
}