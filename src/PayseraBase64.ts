export class PayseraBase64 {
  static encode(data: string): string {
    let output = Buffer.from(data).toString("base64");
    output = output.replace("/", "_");
    output = output.replace("+", "-");
    return output;
  }

  static decode(data: string): Buffer {
    data = data.replace("_", "/");
    data = data.replace("-", "+");
    return Buffer.from(data, "base64");
  }
}
