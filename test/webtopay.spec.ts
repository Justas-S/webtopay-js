import WebToPay from "../src/WebToPay";

test("Encodes basic config correctly", () => {
  const config = {
    sign_password: "password",
    orderid: 125124123,
    projectid: 1512512,
    accepturl: "https://example.com/paysera/accept",
    cancelurl: "https://example.com/paysera/cancel",
    callbackurl: "https://example.com/paysera/callback",
    lang: "LTU",
    amount: 10000,
    currency: "EUR",
    country: "LT",
    test: 0
  };
  const instance = new WebToPay(config.sign_password);

  const query = instance.encodePaymentRequest(config);

  expect(query).not.toBeNull();
  expect(query.data).toEqual(
    "c2lnbl9wYXNzd29yZD1wYXNzd29yZCZvcmRlcmlkPTEyNTEyNDEyMyZwcm9qZWN0aWQ9MTUxMjUxMiZhY2NlcHR1cmw9aHR0cHMlM0ElMkYlMkZleGFtcGxlLmNvbSUyRnBheXNlcmElMkZhY2NlcHQmY2FuY2VsdXJsPWh0dHBzJTNBJTJGJTJGZXhhbXBsZS5jb20lMkZwYXlzZXJhJTJGY2FuY2VsJmNhbGxiYWNrdXJsPWh0dHBzJTNBJTJGJTJGZXhhbXBsZS5jb20lMkZwYXlzZXJhJTJGY2FsbGJhY2smbGFuZz1MVFUmYW1vdW50PTEwMDAwJmN1cnJlbmN5PUVVUiZjb3VudHJ5PUxUJnRlc3Q9MCZ2ZXJzaW9uPTEuNg=="
  );
  expect(query.sign).toEqual("29d8dc8123670dc9dd6a82ea2ccd4807");
});

test("Decodes test config correctly", async () => {
  const data =
    "b3JkZXJpZD0yMjIyJmFtb3VudD0xMDAmbGFuZz1saXQmY3VycmVuY3k9RVVSJnRlc3Q9MSZ2ZXJzaW9uPTEuNiZwcm9qZWN0aWQ9MTExMSZvcmlnaW5hbF9wYXl0ZXh0PSZ0eXBlPUVNQSZwYXltZW50PXdhbGxldCZwYXl0ZXh0PUV4YW1wbGUlMjB0ZXh0JnBfZW1haWw9ZXhhbXBsZSU0MGV4YW1wbGUuY29tJmNvdW50cnk9TFQmX2NsaWVudF9sYW5ndWFnZT1saXQmdHJpZWRfY2hhbmdpbmdfZW1haWw9MSZhY2NvdW50PVRFU1QxMTExMTExMSZzdGF0dXM9MSZwYXlhbW91bnQ9MTAwJnBheWN1cnJlbmN5PUVVUiZyZXF1ZXN0aWQ9NTQ3MyZuYW1lPU5hbWUmc3VyZW5hbWU9TGFzdCUyMG5hbWUmcGF5ZXJfaXBfY291bnRyeT1MVCZwYXllcl9jb3VudHJ5PUxU";
  const ss1 = "e56c7e67559593941a3f919c8ac24503";
  const instance = new WebToPay("test_password");

  const notification = await instance.decodePaymentResponse(data, ss1);

  expect(notification).toEqual({
    orderid: "2222",
    amount: "100",
    lang: "lit",
    currency: "EUR",
    test: "1",
    version: "1.6",
    projectid: "1111",
    original_paytext: "",
    type: "EMA",
    payment: "wallet",
    paytext: "Example text",
    p_email: "example@example.com",
    country: "LT",
    _client_language: "lit",
    tried_changing_email: "1",
    account: "TEST11111111",
    status: "1",
    payamount: "100",
    paycurrency: "EUR",
    requestid: "5473",
    name: "Name",
    surename: "Last name",
    payer_ip_country: "LT",
    payer_country: "LT"
  });
});
