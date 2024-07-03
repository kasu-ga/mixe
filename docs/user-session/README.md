# User Session

## Create

```ts
const session = await mixe.session.create(userId, {
  /* Options */
});

type Options = {
  restricted?: boolean;
  limited?: boolean;
};
```

## Refresh

Increase session lifetime.

```ts
await mixe.session.refresh(sessionId);
```

## Validate

Get information about a session

```ts
const data = await mixe.session.validate(sessionId);
```

## Invalidate

```ts
await mixe.session.invalidate(sessionId);
```

## Invalidate

Delete all user sessions

```ts
await mixe.session.delete(userId);
```
