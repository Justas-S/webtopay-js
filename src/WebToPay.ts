import querystring from "querystring";
import crypto from "crypto";
import { PayseraBase64 } from "./PayseraBase64";
import PayseraSignature from "./PayseraSignature";
import InvalidSignatureError from "./InvalidSignatureError";

export interface RequestOptions {
  projectid: number;
  orderid: number;
  accepturl: string;
  cancelurl: string;
  callbackurl: string;
  version?: string;
  lang?: string;
  amount?: number;
  currency?: string;
  payment?: string;
  country?: string;
  paytext?: string;
  p_firstname?: string;
  p_lastname?: string;
  p_email?: string;
  p_street?: string;
  p_city?: string;
  p_state?: string;
  p_zip?: string;
  pcountrycode?: string;
  only_payments?: string;
  disallow_payments?: string;
  test?: number;
  time_limit?: string;
  personcode?: string;
  developerid?: string;
}

export interface PaymentNotification {
  projectid: number;
  orderid: string;
  lang: string;
  amount: number;
  currency: string;
  payment: string;
  country: string;
  paytext: string;
  name: string;
  surename: string; // surname or surename, Paysera???
  status: PaymentStatus;
  test: string;
  payment_country: string;
  payer_ip_country: string;
  payer_country: string;
  p_email: string;
  requestid: number;
  payamount: number;
  paycurrency: string;
  version: string;
  account: string;
  personcodestatus: PersonCodeStatus;
}
export enum PaymentStatus {
  NotExecuted = 0,
  Successful = 1,
  Accepted = 2,
  AdditionalInfo = 3
}

export enum PersonCodeStatus {
  UnknownYet = 0,
  Match = 1,
  NotMatch = 2,
  Unkonwn = 3
}

const defaultVersion = "1.6";

export default class WebToPay {
  private projectPassword: string;

  private signatureHelper: PayseraSignature;

  constructor(projectPassword: string) {
    this.projectPassword = projectPassword;
    this.signatureHelper = new PayseraSignature();
  }

  encodePaymentRequest(options: RequestOptions) {
    let data = this.encode(options);
    const signature = this.getSignature(data);
    return {
      data,
      sign: signature
    };
  }

  async decodePaymentResponseQuery(
    query: string
  ): Promise<PaymentNotification> {
    const params = querystring.parse(
      PayseraBase64.decode(query).toString("ascii")
    );
    if (typeof params.data !== "string") {
      throw new Error(`Invalid 'data' param '${params.data}' in query`);
    }
    if (typeof params.ss1 !== "string") {
      throw new Error(`Invalid 'ss1' param '${params.ss1}'`);
    }
    if (typeof params.ss2 !== "string") {
      throw new Error(`Invalid 'ss2' param '${params.ss2}'`);
    }
    return this.decodePaymentResponse(params.data, params.ss1, params.ss2);
  }

  async decodePaymentResponse(
    data: string,
    ss1: string,
    ss2: string | null = null
  ): Promise<PaymentNotification> {
    if (!this.verifyHashSignature(data, ss1)) {
      throw new InvalidSignatureError("ss1 signature is invalid");
    }
    if (
      ss2 !== null &&
      !(await this.verifyAsymmetricSignature(data, PayseraBase64.decode(ss2)))
    ) {
      throw new InvalidSignatureError("ss2 signature is invalid");
    }

    const decodedData = PayseraBase64.decode(data).toString("ascii");

    return (querystring.parse(decodedData) as any) as PaymentNotification;
  }

  private encode(data: RequestOptions): string {
    if (!data.version) {
      data.version = defaultVersion;
    }
    let output = querystring.stringify(data as any);
    return PayseraBase64.encode(output);
  }

  private getSignature(data: string): string {
    const hasher = crypto.createHash("md5");
    hasher.update(data);
    hasher.update(this.projectPassword);
    return hasher.digest().toString("hex");
  }

  private verifyHashSignature(data: string, signature: string): boolean {
    const computedSign = this.getSignature(data);
    return computedSign === signature;
  }

  private async verifyAsymmetricSignature(
    data: string,
    signature: Buffer
  ): Promise<boolean> {
    let keyText = await this.signatureHelper.get();
    const verify = crypto.createVerify("RSA-SHA1");
    verify.update(data);
    return verify.verify(keyText, signature);
  }
}
