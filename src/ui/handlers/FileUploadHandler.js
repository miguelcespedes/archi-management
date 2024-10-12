// src/ui/handlers/FileUploadHandler.js

import { Logger } from '../../utils/Logger.js';
import { XMLParser } from '../../domain/XMLParser.js';

export class FileUploadHandler {
    constructor(appLayout) {
        this.appLayout = appLayout;
    }

    // Agregar el método processFileContent
    processFileContent(xmlContent) {
        Logger.info("[INFO] Procesando el contenido del archivo XML...");

        // Aquí puedes parsear el XML y actualizar la interfaz de usuario
        // Por ejemplo, utilizando un XMLParser y actualizando el TreePanel

        // Ejemplo de procesamiento:
        const xmlParser = new XMLParser();
        const parsedData = xmlParser.parse(xmlContent);

        // Actualizar el TreePanel con los datos parseados
        const treeDataService = new TreeDataService();
        const treeStore = treeDataService.createTreeStore(parsedData);

        const treePanel = this.appLayout.getTreePanel();
        treePanel.setStore(treeStore);

        Logger.info("[INFO] Contenido del archivo procesado y TreePanel actualizado.");
    }
}
