"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverProvider = void 0;
const vscode = require("vscode");
class HoverProvider {
    constructor(natives) {
        this.natives = {};
        for (const native of natives) {
            this.addNative(native);
        }
    }
    provideHover(document, position, token) {
        const hoveredWordRange = document.getWordRangeAtPosition(position, /[\w]+/);
        if (!hoveredWordRange)
            return;
        const hoveredWord = document.getText(hoveredWordRange);
        const native = this.natives[hoveredWord];
        return !!native && new vscode.Hover(native, hoveredWordRange);
    }
    addNative(native) {
        const markdown = [];
        const params = native.params.map((p) => `${p.type} ${p.name}`).join(", ");
        const header = new vscode.MarkdownString().appendCodeblock(`${native.return_type && `${native.return_type} ${native.name}(${params})`}`);
        markdown.push(header);
        if (native.comment) {
            const comment = new vscode.MarkdownString().appendMarkdown(native.comment);
            markdown.push(comment);
        }
        this.natives[native.name] = markdown;
    }
}
exports.HoverProvider = HoverProvider;
//# sourceMappingURL=hoverProvider.js.map