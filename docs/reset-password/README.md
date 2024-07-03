# Reset Password

Process for when a user forgets their account password and wants to reset it.

```ts
const user = {}; // user data
const session = await mixe.session.create(user.id, { limited: true });

const code = await mixe.utils.createResetPasswordCode(result.session.id);
await YOUR_MAILER_SERVICE.sendResetPasswordCode(result.user.email, code);
const access_token = await mixe.tokens.create(
  session.id,
  TokenType.AccessToken
);

const code = "000000";
const result = await mixe.tokens.validate(access_token, TokenType.AccessToken);
if (!result) throw new Error("Invalid access_token");
const { session } = result;
const isValid = await mixe.utils.validateResetPasswordCode(session.id, code);
if (!isValid) throw new Error("Invalid code");
await mixe.session.invalidate(session.id);
// UPDATE USER PASSWORD
```
