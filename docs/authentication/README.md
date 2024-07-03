# Authentication

To access the authentication methods you can do it from the client instance.

```ts
mixe.authentication.signin();
mixe.authentication.signup();
```

## Sign In

### Use

```ts
// Instead of Email you can use Username
const result = await mixe.authentication.signin({
  email: "",
  password: "",
});
```

### Errors

> The error received refers to the [`MixeError`](https://github.com/kasu-ga/mixe/blob/main/docs/mixe-error/README.md) instance.

This method can only return an error and that is when the user does not exist or the password is incorrect.

### Result

```ts
type AuthResult = {
  access_token: string;
  refresh_token: string;
  session: SessionData;
  user: UserData;
  restricted: boolean;
};
```

The `restricted` attribute refers to whether the user must go through a two-factor process to fully authenticate. That is, if it is `true` you must do the [`2FA`](https://github.com/kasu-ga/mixe/blob/main/docs/2fa/README.md) process, otherwise you don't have to do anything.

## Sign Up

### Use

```ts
const result = await mixe.authentication.signup({
  username: "",
  email: "",
  password: "",
});
```

### Errors

> The error received refers to the [`MixeError`](https://github.com/kasu-ga/mixe/blob/main/docs/mixe-error/README.md) instance.

This method has two possible errors, one is when the username already exists or the email already exists.

### Result

```ts
type AuthResult = {
  access_token: string;
  refresh_token: string;
  session: SessionData;
  user: UserData;
};
```
