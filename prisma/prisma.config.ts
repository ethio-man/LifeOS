import { defineConfig } from "@prisma/internals";

export default defineConfig({
  prismaConfigPlatform: "node",
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
