// src/core/AppLayout.js

import { Logger } from '../utils/Logger.js';

export class AppLayout {
    constructor() {
        this.viewport = null;
        this.onFileLoadCallback = null;
    }

    initialize() {
        Logger.info("[INFO] Inicializando el layout de la aplicación...");

        this.viewport = Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [
                this.createNorthToolbar(),
                this.createWestTreePanel(),
                this.createCenterDetailPanel()
            ]
        });

        Logger.info("[INFO] Layout de la aplicación inicializado con éxito.");
    }

    createNorthToolbar() {
        return {
            region: 'north',
            xtype: 'toolbar',
            height: 50,
            items: [
                {
                    xtype: 'box',
                    html: '<span style="color: white;">Archimate XML Parser</span>',
                    style: 'margin-right: 10px;'
                },
                {
                    xtype: 'filefield',
                    fieldLabel: 'Cargar archivo',
                    labelWidth: 100,
                    width: 300,
                    buttonText: 'Examinar...',
                    listeners: {
                        change: this.onFileChange.bind(this)
                    }
                }
            ]
        };
    }

    createWestTreePanel() {
        return {
            region: 'west',
            title: 'Archimate Folders',
            xtype: 'treepanel',
            id: 'treePanel',
            width: 300,
            split: true,
            collapsible: true,
            rootVisible: true,
            store: {
                type: 'tree',
                root: {
                    expanded: true,
                    children: []
                }
            }
        };
    }

    createCenterDetailPanel() {
        return {
            region: 'center',
            xtype: 'panel',
            title: 'Detalles del Elemento',
            id: 'detailsPanel',
            autoScroll: true,
            bodyPadding: 10,
            html: '<div id="detailsContainer"></div>'
        };
    }

    setFileLoadHandler(callback) {
        this.onFileLoadCallback = callback;
        Logger.info("[INFO] Callback onFileLoad configurado con éxito.");
    }

    onFileChange(field, value) {
        const file = field.fileInputEl.dom.files[0];
        if (!file) {
            Logger.warn("[WARN] No se seleccionó ningún archivo.");
            return;
        }

        Logger.info(`[INFO] Archivo seleccionado: ${file.name}`);
        const reader = new FileReader();
        reader.onload = (e) => {
            Logger.info("[INFO] Cargando contenido del archivo...");
            const xmlContent = e.target.result;
            if (typeof this.onFileLoadCallback === 'function') {
                this.onFileLoadCallback(xmlContent);
            } else {
                Logger.error("[ERROR] No se pudo cargar el archivo o no se ha definido el callback.");
            }
        };
        reader.readAsText(file);
    }

    getTreePanel() {
        return Ext.getCmp('treePanel');
    }

    getDetailPanel() {
        return Ext.getCmp('detailsPanel');
    }
}