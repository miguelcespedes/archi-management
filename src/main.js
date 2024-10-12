Ext.onReady(function() {
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
                        html: '<span style="color: white;">Archimate XML Parser</span>',
                        style: 'margin-right: 10px;' // Espaciado a la derecha
                    },
                    // Campo para cargar archivos con un botón para examinar
                    {
                        xtype: 'filefield', // Campo para cargar archivos
                        fieldLabel: 'Cargar archivo', // Etiqueta del campo
                        labelWidth: 100, // Ancho de la etiqueta
                        width: 300, // Ancho del campo
                        buttonText: 'Examinar...', // Texto del botón de examinar
                        listeners: {
                            // Listener que se activa cuando el archivo cambia (se selecciona un archivo nuevo)
                            change: function(field, value, eOpts) {
                                const file = field.fileInputEl.dom.files[0]; // Acceder al archivo cargado
                                if (file) {
                                    const reader = new FileReader(); // Crear un objeto FileReader para leer el archivo
                                    reader.onload = function(e) {
                                        const parser = new DOMParser(); // Crear un DOMParser para convertir el archivo en XML
                                        const xmlDoc = parser.parseFromString(e.target.result, "application/xml"); // Parsear el archivo XML
                                        loadTreeData(xmlDoc); // Llamar a la función para cargar los datos en el árbol
                                    };
                                    reader.readAsText(file); // Leer el contenido del archivo como texto
                                }
                            }
                        }
                    }
                ]
            },
            // Región oeste, contiene el árbol de carpetas Archimate
            {
                region: 'west', // Coloca el treepanel en la parte izquierda (oeste)
                title: 'Archimate Folders', // Título del panel
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
                    itemclick: function(view, record, item, index, event, eOpts) {
                        console.log('Nodo seleccionado:', record); // Registro de información del nodo seleccionado
                        const elementData = record.get('data'); // Obtener datos del nodo
                        if (elementData) {
                            // Si el nodo tiene datos, muestra los detalles del elemento
                            console.log('Datos del nodo:', elementData);
                            displayDetails(elementData, record.get('text'));
                        } else {
                            // Si no tiene datos, intenta obtener la información desde "raw"
                            console.log('No se encontraron datos para el nodo seleccionado, intentando usar raw datos.');
                            console.log('Datos en raw:', record.raw);
                            if (record.raw && record.raw.data) {
                                displayDetails(record.raw.data, record.raw.text); // Mostrar detalles desde raw
                            } else {
                                console.log('No se pudo obtener información detallada para el nodo seleccionado.');
                            }
                        }
                    }
                }
            },
            // Región central, contiene un panel para mostrar detalles del elemento seleccionado
            {
                region: 'center', // Coloca el panel en el centro
                xtype: 'panel', // Tipo de componente: panel
                title: 'Detalles del Elemento', // Título del panel
                id: 'detailsPanel', // Identificador del panel
                autoScroll: true, // Habilita el scroll automático
                bodyPadding: 10, // Espaciado interno (padding)
                html: '<div id="detailsContainer"></div>' // Contenedor para los detalles
            },
            // Añadir el footer en la región sur (south)
            
            {
                region: 'south', // Coloca el footer en la parte inferior (sur)
                xtype: 'panel', // Tipo de componente: panel
                height: 40, // Aumentar la altura del footer para dar espacio al botón
                bodyStyle: 'text-align: center; padding: 10px; background-color: #f1f1f1;', // Estilos del panel
                html: `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <p style="margin: 0;">
                            Distribuido bajo la 
                            <a href="https://opensource.org/licenses/MIT" target="_blank" style="text-decoration: none; color: #000;">
                                Licencia MIT
                            </a>
                        </p>
                        
                ` // Contenido del footer mejorado y alineado
            }
            
            
            
            
            
        ]
    });

    const treePanel = Ext.ComponentQuery.query('treepanel')[0]; // Referencia al componente treepanel

    // Función para cargar los datos XML en el árbol
    function loadTreeData(xmlDoc) {
        const modelElement = xmlDoc.getElementsByTagName('archimate:model')[0]; // Obtener el elemento raíz del modelo Archimate
        const projectName = modelElement.getAttribute('name') || 'Sin nombre'; // Obtener el nombre del proyecto o "Sin nombre"
        const rootFolders = xmlDoc.getElementsByTagName('folder'); // Obtener todas las carpetas del archivo XML
        const treeData = []; // Array que contendrá los datos para el árbol

        // Función para procesar cada carpeta y sus elementos hijos
        function processFolder(folder) {
            const folderNode = {
                text: folder.getAttribute('name') || 'Sin nombre', // Nombre de la carpeta o "Sin nombre"
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

        console.log('Datos del árbol:', treeData); // Registro de los datos del árbol
        treePanel.setRootNode({
            text: projectName, // Nombre del proyecto como texto del nodo raíz
            expanded: true, // Expandir automáticamente el nodo raíz
            children: treeData // Asignar los datos procesados al árbol
        });
    }

    // Función para mostrar los detalles del elemento seleccionado
    function displayDetails(elementData, tagName) {
        console.log('Mostrando detalles para:', elementData, 'TagName:', tagName); // Registro del elemento y su tagName
        const detailsPanel = Ext.getCmp('detailsPanel'); // Obtener el panel de detalles por su ID
        let detailsHtml = '<table style="width: 100%; border-collapse: collapse;">'; // Iniciar tabla de detalles
        detailsHtml += '<thead><tr><th style="border: 1px solid black; padding: 8px;">Propiedad</th><th style="border: 1px solid black; padding: 8px;">Valor</th></tr></thead><tbody>';

        // Iterar sobre los atributos del elemento y agregar filas a la tabla
        const properties = Object.keys(elementData.attributes);
        for (let prop of properties) {
            detailsHtml += `<tr><td style="border: 1px solid black; padding: 8px;">${prop}</td><td style="border: 1px solid black; padding: 8px;">${elementData.attributes[prop] || '-'}</td></tr>`;
        }

        detailsHtml += '</tbody></table>'; // Finalizar la tabla
        detailsHtml += `<h3>Contenido HTML del elemento ${tagName}:</h3>`; // Título para el contenido HTML
        detailsHtml += `<div style="border: 1px solid black; padding: 10px; margin-top: 10px;">${Ext.htmlEncode(elementData.innerHTML)}</div>`; // Mostrar contenido HTML

        detailsPanel.update(detailsHtml); // Actualizar el panel de detalles con el nuevo contenido
    }
});
