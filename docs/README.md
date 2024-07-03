# Mixe Documentation

Welcome to the Mixe documentation.

In this documentation you will find the necessary details for you to start using Mixe in your project.

> If for some reason (which may happen) you find an error or something that needs further elaboration, feel free to comment on it or if you would like to correct it later, any help is accepted.

## Quick start

### Installation

#### Core

```bash
npm install mixe
```

#### Adapter

Mixe offers adapters for different databases, here is the complete list:

- [Drizzle](https://github.com/kasu-ga/mixe/blob/main/packages/drizzle/README.md)
- [MongoDB](https://github.com/kasu-ga/mixe/blob/main/packages/mongodb/README.md)
- [Mongoose](https://github.com/kasu-ga/mixe/blob/main/packages/mongoose/README.md)
- [Prisma](https://github.com/kasu-ga/mixe/blob/main/packages/prisma/README.md)

In this example we will use Drizzle and SQLite, but it is almost the same for all cases.

```bash
npm install @mixejs/drizzle
```

### Create Client

```ts
import { Mixe } from "mixejs";
import { DrizzleSQLiteAdapter } from "@mixejs/drizzle";

const adapter = new DrizzleSQLiteAdapter(db, {
  user: User,
  session: Session,
  code: Code,
});

export const mixe = new Mixe(adapter, {
  secret: "", // secret key used to encrypt passwords and jwt
});
```

### User Authentication

#### Sign Up

```ts
const result = await mixe.authentication.signup({
  id: "Unique ID",
  email: "user-email",
  password: "",
});
```

Result Type:

```ts
type AuthResult = {
  access_token: string;
  refresh_token: string;
  session: SessionData;
  user: UserData;
  restricted: false;
};
```

#### Sign In

```ts
const result = await mixe.authentication.signin({
  email: "user-email",
  password: "",
});
```

Result Type:

```ts
type AuthResult = {
  access_token: string;
  refresh_token: string;
  session: SessionData;
  user: UserData;
  restricted: boolean;
};
```

In both cases, a "restricted" property is obtained, which refers to the fact that if the user requires going through the 2FA process, if this is not configured, there is no need to pay attention to it.

For more details about the 2FA process, check [this section](https://github.com/kasu-ga/mixe/blob/main/docs/2fa/README.md)

## Learn More

To delve deeper into the methods and workflows that Mixe offers, check out the following links:

- [Authentication](https://github.com/kasu-ga/mixe/blob/main/docs/authentication/README.md)
- [Reset Password](https://github.com/kasu-ga/mixe/blob/main/docs/reset-password/README.md)
- [2FA Process](https://github.com/kasu-ga/mixe/blob/main/docs/2fa/README.md)
- [Verification Code](https://github.com/kasu-ga/mixe/blob/main/docs/verification-code/README.md)
- [User Session](https://github.com/kasu-ga/mixe/blob/main/docs/user-session/README.md)
