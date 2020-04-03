"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = __importDefault(require("querystring"));
const crypto_1 = __importDefault(require("crypto"));
const PayseraBase64_1 = require("./PayseraBase64");
const PayseraSignature_1 = __importDefault(require("./PayseraSignature"));
const InvalidSignatureError_1 = __importDefault(require("./InvalidSignatureError"));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus[PaymentStatus["NotExecuted"] = 0] = "NotExecuted";
    PaymentStatus[PaymentStatus["Successful"] = 1] = "Successful";
    PaymentStatus[PaymentStatus["Accepted"] = 2] = "Accepted";
    PaymentStatus[PaymentStatus["AdditionalInfo"] = 3] = "AdditionalInfo";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
var PersonCodeStatus;
(function (PersonCodeStatus) {
    PersonCodeStatus[PersonCodeStatus["UnknownYet"] = 0] = "UnknownYet";
    PersonCodeStatus[PersonCodeStatus["Match"] = 1] = "Match";
    PersonCodeStatus[PersonCodeStatus["NotMatch"] = 2] = "NotMatch";
    PersonCodeStatus[PersonCodeStatus["Unkonwn"] = 3] = "Unkonwn";
})(PersonCodeStatus = exports.PersonCodeStatus || (exports.PersonCodeStatus = {}));
const defaultVersion = "1.6";
class WebToPay {
    constructor(projectPassword) {
        this.projectPassword = projectPassword;
        this.signatureHelper = new PayseraSignature_1.default();
    }
    encodePaymentRequest(options) {
        let data = this.encode(options);
        const signature = this.getSignature(data);
        return {
            data,
            sign: signature
        };
    }
    async decodePaymentResponseQuery(query) {
        const params = querystring_1.default.parse(PayseraBase64_1.PayseraBase64.decode(query).toString("ascii"));
        if (typeof params.data !== "string") {
            throw new Error(`Invalid 'data' param: ${params.data} in query`);
        }
        if (typeof params.ss1 !== "string") {
            throw new Error(`Invalid 'ss1' param: ${params.ss1}`);
        }
        if (typeof params.ss2 !== "string") {
            throw new Error(`Invalid 'ss2' param: ${params.ss2}`);
        }
        return this.decodePaymentResponse(params.data, params.ss1, params.ss2);
    }
    async decodePaymentResponse(data, ss1, ss2 = null) {
        if (!this.verifyHashSignature(data, ss1)) {
            throw new InvalidSignatureError_1.default("ss1 signature is invalid");
        }
        if (ss2 !== null &&
            !(await this.verifyAsymmetricSignature(data, PayseraBase64_1.PayseraBase64.decode(ss2)))) {
            throw new InvalidSignatureError_1.default("ss2 signature is invalid");
        }
        const decodedData = PayseraBase64_1.PayseraBase64.decode(data).toString("ascii");
        return querystring_1.default.parse(decodedData);
    }
    encode(data) {
        if (!data.version) {
            data.version = defaultVersion;
        }
        let output = querystring_1.default.stringify(data);
        return PayseraBase64_1.PayseraBase64.encode(output);
    }
    getSignature(data) {
        const hasher = crypto_1.default.createHash("md5");
        hasher.update(data);
        hasher.update(this.projectPassword);
        return hasher.digest().toString("hex");
    }
    verifyHashSignature(data, signature) {
        const computedSign = this.getSignature(data);
        return computedSign === signature;
    }
    async verifyAsymmetricSignature(data, signature) {
        let keyText = await this.signatureHelper.get();
        const verify = crypto_1.default.createVerify("RSA-SHA1");
        verify.update(data);
        return verify.verify(keyText, signature);
    }
}
exports.default = WebToPay;
//# sourceMappingURL=WebToPay.js.map