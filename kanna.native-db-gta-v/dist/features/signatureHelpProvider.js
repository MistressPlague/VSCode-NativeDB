"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureHelpProvider = void 0;
const vscode = require("vscode");
class SignatureHelpProvider {
    constructor(natives) {
        this.natives = {};
        for (const native of natives) {
            this.addNative(native);
        }
    }
    provideSignatureHelp(document, position, token, context) {
        const textBeforeCursor = document.getText(new vscode.Range(new vscode.Position(position.line, 0), position));
        let currentParameter = 0;
        let nestedOpened = 0;
        let nestedClosed = 0;
        let parametersStart = textBeforeCursor.length;
        while (parametersStart > -1) {
            if (textBeforeCursor.charAt(parametersStart) == "," && nestedOpened == nestedClosed) {
                currentParameter++;
            }
            else if (textBeforeCursor.charAt(parametersStart) == ")") {
                nestedClosed++;
            }
            else if (textBeforeCursor.charAt(parametersStart) == "(") {
                nestedOpened++;
            }
            if (textBeforeCursor.charAt(parametersStart) == "(" && nestedOpened > nestedClosed)
                break;
            parametersStart--;
        }
        const methodNameRange = document.getWordRangeAtPosition(new vscode.Position(position.line, parametersStart), /[\w\.]+/);
        if (!methodNameRange)
            return;
        const methodName = document.getText(methodNameRange);
        const signature = this.natives[methodName];
        if (!signature)
            return;
        if (signature.parameters.length > 0 && currentParameter >= signature.parameters.length) {
            const lastParam = signature.parameters[signature.parameters.length - 1].label;
            if (lastParam && lastParam.startsWith("...:"))
                currentParameter = signature.parameters.length - 1;
        }
        let signatureHelp = new vscode.SignatureHelp();
        signatureHelp.activeParameter = currentParameter;
        signatureHelp.activeSignature = 0;
        signatureHelp.signatures.push(signature);
        return signatureHelp;
    }
    addNative(native) {
        const params = native.params.map((p) => `${p.type} ${p.name}`).join(", ");
        const signature = new vscode.SignatureInformation(`${native.return_type && `${native.return_type} ${native.name}(${params})`}`);
        if (native.comment) {
            signature.documentation = new vscode.MarkdownString().appendMarkdown(native.comment);
        }
        if (native.params) {
            for (const param of native.params) {
                const paramInfos = new vscode.ParameterInformation(`${param.name}: ${param.type}`, new vscode.MarkdownString(param.description));
                signature.parameters.push(paramInfos);
            }
        }
        this.natives[native.name] = signature;
    }
}
exports.SignatureHelpProvider = SignatureHelpProvider;
//# sourceMappingURL=signatureHelpProvider.js.map