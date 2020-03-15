# Unofficial Paysera checkout implementation

- [Integration specification](https://developers.paysera.com/en/checkout/integrations/integration-specification)

This library is based on and checked against the [PHP implementation](https://github.com/evp/webtopay-lib-dotnet).

## API

Currently the library supports only two methods.

- `encodePaymentRequest(options)` - returns the encoded request data and a signature that can be sent to Paysera.
- `decodePaymentResponseQuery(query)` - returns the decoded payment notification object. Query is the query string sent by Paysera. By default, the library checks both signatures.
