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
    surename: string;
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
declare enum PaymentStatus {
    NotExecuted = 0,
    Successful = 1,
    Accepted = 2,
    AdditionalInfo = 3
}
declare enum PersonCodeStatus {
    UnknownYet = 0,
    Match = 1,
    NotMatch = 2,
    Unkonwn = 3
}
export default class WebToPay {
    private projectPassword;
    private signatureHelper;
    constructor(projectPassword: string);
    encodePaymentRequest(options: RequestOptions): {
        data: string;
        sign: string;
    };
    decodePaymentResponseQuery(query: string): Promise<PaymentNotification>;
    decodePaymentResponse(data: string, ss1: string, ss2?: string | null): Promise<PaymentNotification>;
    private encode;
    private getSignature;
    private verifyHashSignature;
    private verifyAsymmetricSignature;
}
export {};
