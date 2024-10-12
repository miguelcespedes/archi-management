// src/domain/XMLParser.js

export class XMLParser {
    static parse(xmlContent) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

        if (!xmlDoc) {
            console.error("[ERROR] No se pudo parsear el XML.");
            return null;
        }

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

        return {
            projectName: projectName,
            treeData: treeData
        };
    }
}
