"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
class PayseraSignature {
    constructor() {
        this.KEY_URL = "https://www.paysera.com/download/public.key";
    }
    async get() {
        if (this.key === undefined) {
            this.key = await this.retrieveKey();
        }
        return this.key;
    }
    async retrieveKey() {
        return new Promise((resolv, reject) => {
            https_1.default
                .get(this.KEY_URL, res => {
                let buffer = Buffer.alloc(0);
                res.on("data", chunk => {
                    buffer = Buffer.concat([buffer, chunk]);
                });
                res.on("end", () => {
                    resolv(buffer.toString("utf8"));
                });
                res.on("error", reject);
            })
                .on("error", reject);
        });
    }
}
exports.default = PayseraSignature;
//# sourceMappingURL=PayseraSignature.js.map