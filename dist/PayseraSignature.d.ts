export default class PayseraSignature {
    KEY_URL: string;
    private key;
    get(): Promise<string>;
    private retrieveKey;
}
