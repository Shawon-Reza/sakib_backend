// prisma.config.ts
import "dotenv/config";   // This line is critical — keep it at the very top

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema",           // your current setting (no .prisma extension needed if it's a folder)
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),          // for prisma migrate deploy
  },
});