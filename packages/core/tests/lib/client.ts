import { Mixe } from "../../src";
import { db } from "./database";

export const client = new Mixe(db, {
  secret: "my-secret",
});
