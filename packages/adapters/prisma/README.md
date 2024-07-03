# @mixejs/prisma

> Prisma adapter for Mixe

## Installation

```bash
npm install @mixejs/prisma
```

## Usage

```
// schema.prisma

model User {
  id        String   @id @default(auto()) @map("id")
  email     String   @unique
  password  String
  sessions  Session[]
}

model Session {
  id         String   @id @default(auto()) @map("id")
  expiresAt  Int
  userId     String
  restricted Int
  limited    Int
  user       User     @relation(fields: [userId], references: [id])
  codes      Code[]
}

model Code {
  id         String   @id @default(auto()) @map("id")
  expiresAt  Int
  sessionId  String
  action     String
  value      String
  session    Session  @relation(fields: [sessionId], references: [id])
}
```

```ts
import { PrismaAdapter } from "@mixejs/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adapter = new PrismaAdapter({
  user: prisma.user,
  session: prisma.ession,
  code: prisma.code,
});

export const mixe = new Mixe(adapter, {
  /* Mixe Options */
});
```

## License

[MIT License](https://github.com/kasu-ga/mixe/blob/main/LICENSE.md)
