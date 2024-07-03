# Verification Code

Basic workflow to create and validate verification codes using sessions.

```ts
// create code
const session = await mixe.session.create(userId /* Options */);
const code = await mixe.codes.create(session.id, "action name or id");

// validate
const isValid = await mixe.codes.validate(
  sessionId,
  "action name or id",
  inputCode
); // -> Boolean
```
