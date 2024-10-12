// src/core/AppLayout.js

import { Logger } from '../utils/Logger.js';

export class AppLayout {
    constructor() {
        this.viewport = null;
        this.onFileLoadCallback = null;
        this.fileInputField = null;
        this.uploadButton = null;
        this.mainPanel = null;
    }

    initialize() {
        Logger.info("[INFO] Inicializando el layout de la aplicación...");

        this.initComponents();
        this.renderLayout();

        Logger.info("[INFO] Layout de la aplicación inicializado con éxito.");
    }

    initComponents() {
        // Crear y almacenar referencias a los componentes
        this.fileInputField = Ext.create('Ext.form.field.File', {
            fieldLabel: 'Cargar archivo',
            labelWidth: 100,
            width: 300,
            buttonText: 'Examinar...',
            listeners: {
                change: this.onFileChange.bind(this)
            }
        });

        this.uploadButton = Ext.create('Ext.Button', {
            text: 'Subir',
            margin: '0 0 0 10',
            handler: this.onUploadButtonClick.bind(this)
        });

        this.mainPanel = Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [
                {
                    region: 'north',
                    xtype: 'toolbar',
                    height: 50,
                    items: [
                        {
                            xtype: 'box',
                            html: '<span style="color: white;">Archimate XML Parser</span>',
                            style: 'margin-right: 10px;'
                        },
                        this.fileInputField,
                        this.uploadButton
                    ]
                },
                this.createWestTreePanel(),
                this.createCenterDetailPanel()
            ]
        });
    }

    renderLayout() {
        // El Viewport ya se agrega automáticamente, no es necesario hacer Ext.Viewport.add()
        // Si usas Ext.create('Ext.container.Viewport', {...}), se renderiza automáticamente.
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

    // Agregar los métodos getFileInputField y getUploadButton
    getFileInputField() {
        return this.fileInputField;
    }

    getUploadButton() {
        return this.uploadButton;
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

    // Método para manejar el clic del botón de subir (si es necesario)
    onUploadButtonClick() {
        // Aquí puedes manejar la lógica de subida del archivo si es diferente
        // Por ejemplo, puedes llamar a onFileChange manualmente o realizar otras acciones
        this.onFileChange(this.fileInputField);
    }

    getTreePanel() {
        return Ext.getCmp('treePanel');
    }

    getDetailPanel() {
        return Ext.getCmp('detailsPanel');
    }
}
