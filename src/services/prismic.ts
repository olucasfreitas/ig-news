import { createClient } from "@prismicio/client";

export function getPrismicClient() {
  if (!process.env.PRISMIC_ENDPOINT || !process.env.PRISMIC_ACCESS_TOKEN) {
    throw new Error("Missing Prismic config");
  }

  const prismic = createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return prismic;
}
