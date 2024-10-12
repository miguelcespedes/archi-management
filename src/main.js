Ext.onReady(function() {
    // Crear viewport con regiones
    Ext.create('Ext.container.Viewport', {
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
                    {
                        xtype: 'filefield',
                        fieldLabel: 'Cargar archivo',
                        labelWidth: 100,
                        width: 300,
                        buttonText: 'Examinar...',
                        listeners: {
                            change: function(field, value, eOpts) {
                                const file = field.fileInputEl.dom.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = function(e) {
                                        const parser = new DOMParser();
                                        const xmlDoc = parser.parseFromString(e.target.result, "application/xml");
                                        loadTreeData(xmlDoc);
                                    };
                                    reader.readAsText(file);
                                }
                            }
                        }
                    }
                ]
            },
            {
                region: 'west',
                title: 'Archimate Folders',
                xtype: 'treepanel',
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
                },
                listeners: {
                    itemclick: function(view, record, item, index, event, eOpts) {
                        console.log('Nodo seleccionado:', record);
                        const elementData = record.get('data');
                        if (elementData) {
                            console.log('Datos del nodo:', elementData);
                            displayDetails(elementData, record.get('text'));
                        } else {
                            console.log('No se encontraron datos para el nodo seleccionado, intentando usar raw datos.');
                            console.log('Datos en raw:', record.raw);
                            if (record.raw && record.raw.data) {
                                displayDetails(record.raw.data, record.raw.text);
                            } else {
                                console.log('No se pudo obtener información detallada para el nodo seleccionado.');
                            }
                        }
                    }
                }
            },
            {
                region: 'center',
                xtype: 'panel',
                title: 'Detalles del Elemento',
                id: 'detailsPanel',
                autoScroll: true,
                bodyPadding: 10,
                html: '<div id="detailsContainer"></div>'
            }
        ]
    });

    const treePanel = Ext.ComponentQuery.query('treepanel')[0];

    // Función para cargar datos en el árbol
    function loadTreeData(xmlDoc) {
        const modelElement = xmlDoc.getElementsByTagName('archimate:model')[0];
        const projectName = modelElement.getAttribute('name') || 'Sin nombre';
        const rootFolders = xmlDoc.getElementsByTagName('folder');
        const treeData = [];

        function processFolder(folder) {
            const folderNode = {
                text: folder.getAttribute('name') || 'Sin nombre',
                expanded: false,
                children: [],
                data: null
            };

            // Procesar subcarpetas
            const subfolders = Array.from(folder.children).filter(element => element.tagName === 'folder');
            for (let subfolder of subfolders) {
                folderNode.children.push(processFolder(subfolder));
            }

            // Procesar elementos
            const elements = Array.from(folder.children).filter(element => element.tagName !== 'folder');
            for (let element of elements) {
                folderNode.children.push({
                    text: element.getAttribute('name') || element.tagName,
                    leaf: true,
                    data: {
                        tagName: element.tagName,
                        attributes: Array.from(element.attributes).reduce((acc, attr) => {
                            acc[attr.name] = attr.value;
                            return acc;
                        }, {}),
                        innerHTML: element.innerHTML
                    }
                });
            }

            return folderNode;
        }

        for (let folder of rootFolders) {
            if (folder.parentElement.tagName !== 'folder') {
                treeData.push(processFolder(folder));
            }
        }

        console.log('Datos del árbol:', treeData);
        treePanel.setRootNode({
            text: projectName,
            expanded: true,
            children: treeData
        });
    }

    // Función para mostrar detalles del elemento
    function displayDetails(elementData, tagName) {
        console.log('Mostrando detalles para:', elementData, 'TagName:', tagName);
        const detailsPanel = Ext.getCmp('detailsPanel');
        let detailsHtml = '<table style="width: 100%; border-collapse: collapse;">';
        detailsHtml += '<thead><tr><th style="border: 1px solid black; padding: 8px;">Propiedad</th><th style="border: 1px solid black; padding: 8px;">Valor</th></tr></thead><tbody>';

        const properties = Object.keys(elementData.attributes);
        for (let prop of properties) {
            detailsHtml += `<tr><td style="border: 1px solid black; padding: 8px;">${prop}</td><td style="border: 1px solid black; padding: 8px;">${elementData.attributes[prop] || '-'}</td></tr>`;
        }

        detailsHtml += '</tbody></table>';
        detailsHtml += `<h3>Contenido HTML del elemento ${tagName}:</h3>`;
        detailsHtml += `<div style="border: 1px solid black; padding: 10px; margin-top: 10px;">${Ext.htmlEncode(elementData.innerHTML)}</div>`;
        detailsPanel.update(detailsHtml);
    }
});
