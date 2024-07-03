import { GenerateId, TokenType } from "../src";
import { client } from "./lib/client";
import { users } from "./lib/database";

test("User sign-up process.", async () => {
  await client.authentication.signup({
    id: GenerateId(),
    email: "example@mail.com",
    password: "12345678",
  });
  expect(users.length === 1);
});

test("User sign-in process.", async () => {
  const { user, access_token } = await client.authentication.signin({
    email: "example@mail.com",
    password: "12345678",
  });
  const tokenData = await client.tokens.validate(
    access_token,
    TokenType.AccessToken
  );
  expect(tokenData?.user.id === user.id);
});
