"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const completionItemProvider_1 = require("./features/completionItemProvider");
const hoverProvider_1 = require("./features/hoverProvider");
const signatureHelpProvider_1 = require("./features/signatureHelpProvider");
const nativeService_1 = require("./data/nativeService");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const natives = yield nativeService_1.NativeService.getAllNatives();
        let disposable = vscode.languages.registerHoverProvider("lua", new hoverProvider_1.HoverProvider(natives));
        context.subscriptions.push(disposable);
        disposable = vscode.languages.registerSignatureHelpProvider("lua", new signatureHelpProvider_1.SignatureHelpProvider(natives), "(", ",");
        context.subscriptions.push(disposable);
        disposable = vscode.languages.registerCompletionItemProvider("lua", new completionItemProvider_1.CompletionItemProvider(natives));
        context.subscriptions.push(disposable);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map