"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PayseraBase64 {
    static encode(data) {
        let output = Buffer.from(data).toString("base64");
        output = output.replace("/", "_");
        output = output.replace("+", "-");
        return output;
    }
    static decode(data) {
        data = data.replace("_", "/");
        data = data.replace("-", "+");
        return Buffer.from(data, "base64");
    }
}
exports.PayseraBase64 = PayseraBase64;
//# sourceMappingURL=PayseraBase64.js.map