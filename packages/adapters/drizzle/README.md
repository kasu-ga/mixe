# @mixejs/drizzle

> Drizzle adapter for Mixe

## Installation

```bash
npm install @mixejs/drizzle
```

## Usage

You can change this to any of the other adapters available (MySQL or Postgress).

```ts
import { DrizzleSQLiteAdapter } from "@mixejs/drizzle";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const User = sqliteTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const Session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => User.id),
  restricted: integer("restricted").notNull(),
  limited: integer("limited").notNull(),
});

export const Code = sqliteTable("code", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at").notNull(),
  sessionId: text("session_id")
    .notNull()
    .references(() => Session.id),
  action: text("action").notNull(),
  value: text("value").notNull(),
});

const adapter = new DrizzleSQLiteAdapter(db, {
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
