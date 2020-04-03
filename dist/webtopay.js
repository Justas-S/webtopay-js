"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = require("querystring");
const buffer_1 = require("buffer");
const crypto_1 = require("crypto");
class WebToPay {
    getRequestQuery(options) {
        let data = this.encode(options);
        const signature = this.getSignature(data);
        return querystring_1.stringify({
            data,
            sign: signature
        });
    }
    encode(data) {
        let output = querystring_1.stringify(data);
        output = buffer_1.Buffer.from(output).toString("base64");
        output = output.replace("/", "_");
        output = output.replace("+", "-");
        return output;
    }
    getSignature(data) {
        const hasher = crypto_1.createHash("md5");
        hasher.update(data);
        hasher.update(this.projectPassword);
        return hasher.digest().toString("ascii");
    }
}
exports.default = WebToPay;
//# sourceMappingURL=webtopay.js.map