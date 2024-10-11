// src/ui/components/DetailPanel.js

export class DetailPanel {
    constructor(appLayout) {
        this.detailPanel = appLayout.getDetailPanel();
    }

    updateContent(content) {
        if (this.detailPanel) {
            this.detailPanel.update(`<pre>${content}</pre>`);
        } else {
            console.error("[ERROR] No se pudo actualizar el panel de detalles.");
        }
    }
}