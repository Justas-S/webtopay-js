import https from "https";

export default class PayseraSignature {
  KEY_URL = "https://www.paysera.com/download/public.key";

  private key: string;

  async get(): Promise<string> {
    if (this.key === undefined) {
      this.key = await this.retrieveKey();
    }
    return this.key;
  }

  private async retrieveKey(): Promise<string> {
    return new Promise((resolv, reject) => {
      https
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
