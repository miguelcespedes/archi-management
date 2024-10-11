// src/core/AppLayout.js

import { Logger } from '../utils/Logger.js';

export class AppLayout {
    constructor() {
        this.viewport = null;
        this.treePanel = null;
        this.toolbar = null;
    }

    initialize() {
        Logger.info("[INFO] Inicializando el layout de la aplicación...");
        this.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            items: [
                {
                    xtype: 'filefield',
                    buttonOnly: true,
                    hideLabel: true,
                    buttonText: 'Cargar Archivo',
                    listeners: {
                        change: (field, value) => {
                            const file = field.fileInputEl.dom.files[0];
                            if (file) {
                                Logger.info(`[INFO] Archivo seleccionado: ${file.name}`);
                                field.reset(); // Reiniciar el campo de archivo para permitir cargar el mismo archivo nuevamente
                            }
                        }
                    }
                },
                {
                    xtype: 'tbfill'
                },
                {
                    xtype: 'button',
                    text: 'Ayuda',
                    handler: () => {
                        Logger.info("[INFO] Ayuda seleccionada");
                    }
                }
            ]
        });

        this.treePanel = Ext.create('Ext.tree.Panel', {
            region: 'west',
            title: 'Árbol de Navegación',
            width: 300,
            split: true,
            collapsible: true,
            rootVisible: false,
            id: 'treePanel'
        });

        this.viewport = Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [
                this.toolbar,
                this.treePanel,
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
        return this.treePanel;
    }

    getDetailPanel() {
        return Ext.getCmp('detailPanel');
    }
}