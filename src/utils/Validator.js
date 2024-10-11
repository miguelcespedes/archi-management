// src/utils/Validator.js

export class Validator {
    static isValidXML(xmlContent) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');
            return !xmlDoc.querySelector('parsererror');
        } catch (error) {
            return false;
        }
    }

    static isNotEmpty(value) {
        return value !== undefined && value !== null && value.trim() !== '';
    }
}