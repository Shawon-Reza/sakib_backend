// prisma.config.ts
import "dotenv/config";

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Fallback to prevent crash if variable is missing during loading
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});