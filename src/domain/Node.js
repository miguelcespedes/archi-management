// src/domain/Node.js

export class Node {
    constructor(id, name, type, children = []) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.children = children;
    }

    addChild(childNode) {
        this.children.push(childNode);
    }

    isLeaf() {
        return this.children.length === 0;
    }
}