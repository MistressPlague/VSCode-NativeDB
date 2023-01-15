"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletionItemProvider = void 0;
const vscode = require("vscode");
class CompletionItemProvider {
    constructor(natives) {
        this.natives = [];
        this.previousResult = [];
        this.previousText = "";
        for (const native of natives) {
            this.addNative(native);
        }
    }
    provideCompletionItems(document, position, token, context) {
        const wordRange = document.getWordRangeAtPosition(new vscode.Position(position.line, position.character - 1));
        if (!wordRange)
            return;
        const text = document.getText(wordRange).toLowerCase();
        const natives = text.startsWith(this.previousText) ? this.previousResult : this.natives;
        const result = natives.filter((n) => n.name.indexOf(text) != -1);
        this.previousText = text;
        this.previousResult = result;
        return result.map((n) => n.completionItem);
    }
    addNative(native) {
        const completionItem = new vscode.CompletionItem(native.name, vscode.CompletionItemKind.Function);
        completionItem.documentation = new vscode.MarkdownString();
        const params = native.params.map((p) => `${p.type} ${p.name}`).join(", ");
        completionItem.documentation.appendCodeblock(`${native.return_type && `${native.return_type} ${native.name}(${params})`}`);
        if (native.comment) {
            completionItem.documentation.appendMarkdown(`  \n\n${native.comment}`);
        }
        this.natives.push({ name: native.name.toLowerCase(), completionItem });
    }
}
exports.CompletionItemProvider = CompletionItemProvider;
//# sourceMappingURL=completionItemProvider.js.map