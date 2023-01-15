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
exports.NativeService = void 0;
const node_fetch_1 = require("node-fetch");
const specificFunctions_1 = require("./specificFunctions");
const documentationUrls = [
    "https://plague.cx/GTA/natives.json"
];
class NativeService {
    static getAllNatives() {
        return __awaiter(this, void 0, void 0, function* () {
            const allNatives = specificFunctions_1.specificFunctions;
            const nativeArrays = yield Promise.all(documentationUrls.map((url) => this.fetchNatives(url)));
            for (const natives of nativeArrays) {
                allNatives.push(...natives);
            }
            return allNatives;
        });
    }
    static fetchNatives(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, node_fetch_1.default)(url);
            const responseData = (yield response.json());
            const natives = [];
            for (const native of Object.values(responseData)) {
                if (native.name) {
                    native.name = native.namespace + "." + native.name;
                    native.comment = native.comment && this.parseNativeDescription(native.comment);
                    native.params = this.parseNativeParams(native.params);
                    native.return_type = native.return_type && this.parseType(native.return_type);
                    natives.push(native);
                }
            }
            return natives;
        });
    }
    static parseNativeName(rawName) {
        return rawName
            .split("_")
            .filter((n) => n.length > 0)
            .map((n) => n.substr(0, 1) + n.substr(1).toLowerCase())
            .join("");
    }
    static parseNativeDescription(rawDescription) {
        const from = rawDescription.startsWith("```") ? 3 : 0;
        const to = rawDescription.endsWith("```") ? rawDescription.length - 3 : rawDescription.length;
        return rawDescription.substr(from, to - from);
    }
    static parseNativeParams(params) {
        return params.map((p) => (Object.assign(Object.assign({}, p), { type: this.parseType(p.type) })));
    }
    static parseType(rawType) {
        return rawType.replace("*", "");
        const type = rawType.replace("*", "");
        switch (type) {
            case "int":
            case "float":
            case "long":
                return "number";
            case "BOOL":
                return "boolean";
            case "char":
                return "string";
            case "Vector3":
                return "vector3";
            case "Any":
                return "any";
            case "void":
                return "";
            default:
                return type;
        }
    }
}
exports.NativeService = NativeService;
//# sourceMappingURL=nativeService.js.map