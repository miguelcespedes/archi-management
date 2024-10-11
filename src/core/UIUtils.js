// src/core/UIUtils.js

export class UIUtils {
    static showLoadingSpinner(targetElement) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        targetElement.appendChild(spinner);
    }

    static removeLoadingSpinner(targetElement) {
        const spinner = targetElement.querySelector('.loading-spinner');
        if (spinner) {
            targetElement.removeChild(spinner);
        }
    }

    static showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        document.body.appendChild(messageElement);

        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 3000);
    }
}