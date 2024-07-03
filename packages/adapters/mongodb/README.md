# @mixejs/mongodb

> Mongodb adaptar for Mixe

## Installation

```bash
npm install @mixejs/mongodb
```

## Usage

```ts
import { MongoDbAdapter } from "@mixejs/mongodb";

interface IUser {
  id: string;
  email: string;
  password: string;
}

interface ISession {
  id: string;
  expiresAt: number;
  userId: string;
  restricted: boolean;
  limited: boolean;
}

interface ICode {
  id: string;
  expiresAt: number;
  sessionId: string;
  action: string;
  value: string;
}

const User = db.collection<IUser>("user");
const Session = db.collection<ISession>("session");
const Code = db.collection<ICode>("code");

const adapter = new MongoDbAdapter({
  user: User,
  session: Session,
  code: Code,
});

export const mixe = new Mixe(adapter, {
  /* Mixe Options */
});
```

## License

[MIT License](https://github.com/kasu-ga/mixe/blob/main/LICENSE.md)
