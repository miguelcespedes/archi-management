import { Logger } from '../../utils/Logger.js';

export class TreeComponent {
    constructor(container) {
        if (!container || typeof container.add !== 'function') {
            Logger.error("[ERROR] Contenedor para TreeComponent no encontrado o no es válido.");
            return;
        }

        this.treePanel = Ext.create('Ext.tree.Panel', {
            title: 'Modelo de ArchiMate',
            rootVisible: false,
            store: {
                type: 'tree',
                root: {
                    text: 'Modelo Completo',
                    expanded: true,
                    children: []
                }
            }
        });

        container.on('afterrender', () => {
            container.add(this.treePanel);
            Logger.info("[INFO] TreeComponent añadido al contenedor con éxito.");
        });
    }

    getPanel() {
        return this.treePanel;
    }
}
