// src/core/AppLayout.js

import { Logger } from '../utils/Logger.js';

export class AppLayout {
    constructor() {
        this.viewport = null;
    }

    initialize() {
        Logger.info("[INFO] Inicializando el layout de la aplicación...");
        this.viewport = Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [
                {
                    region: 'west',
                    title: 'Árbol de Navegación',
                    width: 300,
                    split: true,
                    collapsible: true,
                    id: 'treePanel'
                },
                {
                    region: 'center',
                    title: 'Panel de Detalles',
                    id: 'detailPanel',
                    html: '<h3>Seleccione un elemento del árbol para ver detalles</h3>'
                }
            ]
        });
    }

    getTreePanel() {
        return Ext.getCmp('treePanel');
    }

    getDetailPanel() {
        return Ext.getCmp('detailPanel');
    }
}