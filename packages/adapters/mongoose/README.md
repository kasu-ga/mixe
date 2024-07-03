# @mixejs/mongoose

> Mongoose adapter for Mixe

## Installation

```bash
npm install @mixejs/mongoose
```

## Usage

```ts
import { MongooseAdapter } from "@mixejs/mongoose";
import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  id: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model<IUser>("User", userSchema);

interface ISession extends Document {
  id: string;
  expiresAt: number;
  userId: string;
  restricted: boolean;
  limited: boolean;
}

const sessionSchema = new Schema<ISession>({
  id: { type: String, required: true, unique: true },
  expiresAt: { type: Number, required: true },
  userId: { type: String, required: true },
  restricted: { type: Boolean, required: true },
  limited: { type: Boolean, required: true },
});

const Session = mongoose.model<ISession>("Session", sessionSchema);

interface ICode extends Document {
  id: string;
  expiresAt: number;
  sessionId: string;
  action: string;
  value: string;
}

const codeSchema = new Schema<ICode>({
  id: { type: String, required: true, unique: true },
  expiresAt: { type: Number, required: true },
  sessionId: { type: String, required: true },
  action: { type: String, required: true },
  value: { type: String, required: true },
});

const Code = mongoose.model<ICode>("Code", codeSchema);

const adapter = new MongooseAdapter(db, {
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
