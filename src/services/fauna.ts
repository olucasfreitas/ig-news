import { Client } from "faunadb";

if (!process.env.FAUNADB_KEY) {
  throw new Error("Missing FaunaDB Key");
}

export const fauna = new Client({
  secret: process.env.FAUNADB_KEY,
});
