import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Used by `prisma migrate` / `prisma db push` / introspection only.
    // The running app builds its own adapter in src/lib/db.ts.
    url: process.env["DATABASE_URL"] ?? "file:./prisma/dev.db",
  },
});
