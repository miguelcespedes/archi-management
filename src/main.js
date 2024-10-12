Ext.onReady(function () {
    // Crear la ventana modal (wizard)
    const fileUploadWindow = Ext.create('Ext.window.Window', {
        title: 'Archi Management Tool',
        modal: true,
        closable: false, // No se puede cerrar hasta que se cargue el archivo
        width: 400,
        height: 200,
        layout: 'fit',
        items: [
            {
                xtype: 'form',
                bodyPadding: 10,
                items: [
                    {
                        xtype: 'box',
                        html: '<h3>Please upload your Archimate file to begin</h3>',
                        style: 'text-align: center; margin-bottom: 10px;'
                    },
                    {
                        xtype: 'filefield',
                        fieldLabel: 'Upload File',
                        labelWidth: 100,
                        width: '100%',
                        buttonText: 'Browse...',
                        listeners: {
                            change: function (field, value, eOpts) {
                                const file = field.fileInputEl.dom.files[0]; // Acceder al archivo cargado
                                if (file) {
                                    const reader = new FileReader(); // Crear un objeto FileReader para leer el archivo
                                    reader.onload = function (e) {
                                        const parser = new DOMParser(); // Crear un DOMParser para convertir el archivo en XML
                                        const xmlDoc = parser.parseFromString(e.target.result, "application/xml"); // Parsear el archivo XML
                                        loadTreeData(xmlDoc); // Llamar a la función para cargar los datos en el árbol
                                        fileUploadWindow.close(); // Cerrar la ventana modal automáticamente después de cargar
                                    };
                                    reader.readAsText(file); // Leer el contenido del archivo como texto
                                }
                            }
                        }
                    }
                ]
            }
        ]
    });

    fileUploadWindow.show(); // Mostrar la ventana modal

    // Crear un Viewport que organiza los componentes en un diseño de "border" (con áreas: norte, oeste, centro)
    Ext.create('Ext.container.Viewport', {
        layout: 'border', // Define el layout de tipo 'border' con regiones
        items: [
            // Región norte, contiene una barra de herramientas (toolbar)
            {
                region: 'north', // Coloca el toolbar en la parte superior (norte)
                xtype: 'toolbar', // Tipo de componente: barra de herramientas
                height: 50, // Altura de la barra
                items: [
                    // Caja que muestra el título de la aplicación
                    {
                        xtype: 'box',
                        html: '<h2 style="color: #04408c; margin-left:5px;">Archi Management Tool</h2>',
                        style: 'margin-right: 10px;' // Espaciado a la derecha
                    }
                ]
            },
            // Región oeste, contiene el árbol de carpetas Archimate
            {
                region: 'west', // Coloca el treepanel en la parte izquierda (oeste)
                title: 'Project', // Título del panel
                xtype: 'treepanel', // Tipo de componente: panel de árbol
                width: 300, // Ancho del panel
                split: true, // Habilita la barra divisoria para redimensionar
                collapsible: true, // Permite colapsar el panel
                rootVisible: true, // Muestra el nodo raíz
                store: {
                    type: 'tree', // Tipo de store (datos) es un árbol
                    root: { // Nodo raíz vacío inicial
                        expanded: true, // Nodo expandido por defecto
                        children: [] // Inicialmente no tiene hijos
                    }
                },
                listeners: {
                    // Listener que se activa cuando se hace clic en un nodo del árbol
                    itemclick: function (view, record, item, index, event, eOpts) {
                        console.log('Selected node:', record); // Registro de información del nodo seleccionado
                        const elementData = record.get('data'); // Obtener datos del nodo
                        if (elementData) {
                            // Si el nodo tiene datos, muestra los detalles del elemento
                            console.log('Node data:', elementData);
                            displayDetails(elementData, record.get('text'));
                        } else {
                            // Si no tiene datos, intenta obtener la información desde "raw"
                            console.log('No data found for the selected node, attempting to use raw data.');
                            console.log('Raw data:', record.raw);
                            if (record.raw && record.raw.data) {
                                displayDetails(record.raw.data, record.raw.text); // Mostrar detalles desde raw
                            } else {
                                console.log('Detailed information for the selected node could not be retrieved.');
                            }
                        }
                    }
                }
            },
            // Región central, contiene un panel para mostrar detalles del elemento seleccionado
            {
                region: 'center', // Coloca el panel en el centro
                xtype: 'panel', // Tipo de componente: panel
                title: 'Properties', // Título del panel
                id: 'detailsPanel', // Identificador del panel
                autoScroll: true, // Habilita el scroll automático
                bodyPadding: 10, // Espaciado interno (padding)
                html: '<div id="detailsContainer"></div>' // Contenedor para los detalles
            },
            {
                region: 'south', // Coloca el footer en la parte inferior (sur)
                xtype: 'panel', // Tipo de componente: panel
                height: 40, // Altura del footer
                bodyStyle: 'text-align: center; padding: 10px; background-color: #f1f1f1;', // Estilos del panel
                html: `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <p style="margin: 0;">
                            Released under the 
                            <a href="https://opensource.org/licenses/MIT" target="_blank" style="text-decoration: none; color: #000;">
                                MIT License
                            </a> - Developed by <a href="https://github.com/miguelcespedes" target="_blank" style="text-decoration: none; color: #000;">
                                Miguel Céspedes
                            </a>
                        </p>
                    </div>
                ` // Contenido del footer con la licencia y enlace a GitHub
            }
            
        ]
    });

    const treePanel = Ext.ComponentQuery.query('treepanel')[0]; // Referencia al componente treepanel

    // Función para cargar los datos XML en el árbol
    function loadTreeData(xmlDoc) {
        const modelElement = xmlDoc.getElementsByTagName('archimate:model')[0]; // Obtener el elemento raíz del modelo Archimate
        const projectName = modelElement.getAttribute('name') || 'Untitled'; // Obtener el nombre del proyecto o "Untitled"
        const rootFolders = xmlDoc.getElementsByTagName('folder'); // Obtener todas las carpetas del archivo XML
        const treeData = []; // Array que contendrá los datos para el árbol

        // Función para procesar cada carpeta y sus elementos hijos
        function processFolder(folder) {
            const folderNode = {
                text: folder.getAttribute('name') || 'Untitled', // Nombre de la carpeta o "Untitled"
                expanded: false, // No expandir automáticamente
                children: [], // Inicialmente sin hijos
                data: null // Nodo sin datos asociados
            };

            // Procesar subcarpetas de la carpeta actual
            const subfolders = Array.from(folder.children).filter(element => element.tagName === 'folder');
            for (let subfolder of subfolders) {
                folderNode.children.push(processFolder(subfolder)); // Recursivamente agregar subcarpetas
            }

            // Procesar elementos dentro de la carpeta
            const elements = Array.from(folder.children).filter(element => element.tagName !== 'folder');
            for (let element of elements) {
                folderNode.children.push({
                    text: element.getAttribute('name') || element.tagName, // Nombre del elemento o su tagName
                    leaf: true, // Indica que es un nodo hoja (sin hijos)
                    data: { // Asociar los datos del elemento
                        tagName: element.tagName, // Nombre del tag
                        attributes: Array.from(element.attributes).reduce((acc, attr) => {
                            acc[attr.name] = attr.value; // Atributos como objeto clave-valor
                            return acc;
                        }, {}),
                        innerHTML: element.innerHTML // Contenido interno del elemento
                    }
                });
            }

            return folderNode; // Retorna el nodo de la carpeta procesada
        }

        // Procesar cada carpeta raíz
        for (let folder of rootFolders) {
            if (folder.parentElement.tagName !== 'folder') {
                treeData.push(processFolder(folder)); // Solo procesar carpetas raíz (no anidadas)
            }
        }

        console.log('Tree data:', treeData); // Registro de los datos del árbol
        treePanel.setRootNode({
            text: projectName, // Nombre del proyecto como texto del nodo raíz
            expanded: true, // Expandir automáticamente el nodo raíz
            children: treeData // Asignar los datos procesados al árbol
        });
    }

    // Función para mostrar los detalles del elemento seleccionado
    function displayDetails(elementData, tagName) {
        console.log('Displaying details for:', elementData, 'TagName:', tagName); // Registro del elemento y su tagName
        const detailsPanel = Ext.getCmp('detailsPanel'); // Obtener el panel de detalles por su ID
        let detailsHtml = '<table style="width: 100%; border-collapse: collapse;">'; // Iniciar tabla de detalles
        detailsHtml += '<thead><tr><th style="border: 1px solid black; padding: 8px;">Property</th><th style="border: 1px solid black; padding: 8px;">Value</th></tr></thead><tbody>';

        // Iterar sobre los atributos del elemento y agregar filas a la tabla
        const properties = Object.keys(elementData.attributes);
        for (let prop of properties) {
            detailsHtml += `<tr><td style="border: 1px solid black; padding: 8px;">${prop}</td><td style="border: 1px solid black; padding: 8px;">${elementData.attributes[prop] || '-'}</td></tr>`;
        }

        detailsHtml += '</tbody></table>'; // Finalizar la tabla
        detailsHtml += `<h3>HTML content of ${tagName} element:</h3>`; // Título para el contenido HTML
        detailsHtml += `<div style="border: 1px solid black; padding: 10px; margin-top: 10px;">${Ext.htmlEncode(elementData.innerHTML)}</div>`; // Mostrar contenido HTML

        detailsPanel.update(detailsHtml); // Actualizar el panel de detalles con el nuevo contenido
    }
});
