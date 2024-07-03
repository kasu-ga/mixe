# 2FA

> This is configured by default, but if no user enables this, there is no need to review this guide.

In the user model, an attribute `enable2FA` is defined, when it is `true`, the 2FA process is carried out automatically, that is, an access_token is generated, where the session is restricted.

To enable the user session, you must generate a verification code and then validate it.

## Example

```ts
// sign in and send 2fa code

const result = await mixe.authentication.signin({
  email: "",
  password: "",
});

if (result.restricted) {
  const code = await mixe.authentication.create2FACode(result.session.id);
  await YOUR_MAILER_SERVICE.send2FACode(result.user.email, code);
}

// validate 2fa code
const access_token = "USER TOKEN";
const code = "000000";
const result = await mixe.tokens.validate(access_token, TokenType.AccessToken);
if (!result) throw new Error("Invalid access_token");
const { session } = result;
const isValid = await mixe.authentication.validate2FACode(session.id, code);
if (!isValid) throw new Error("Invalid code");
await mixe.db.session.update(session.id, { restricted: false });
```
