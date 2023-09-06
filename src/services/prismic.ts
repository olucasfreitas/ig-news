import { createClient } from "@prismicio/client";

if (!process.env.PRISMIC_ENDPOINT || !process.env.PRISMIC_ACCESS_TOKEN) {
  throw new Error("Missing Prismic config");
}

export const prismic = createClient(process.env.PRISMIC_ENDPOINT, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});
