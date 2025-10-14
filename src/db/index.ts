import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Initialize the database lazily to avoid throwing during build-time imports.
export const db = (() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        // Provide a proxy that throws only when actually used at runtime.
        return new Proxy(
            {},
            {
                get() {
                    throw new Error("DATABASE_URL is missing from .env file");
                },
            }
        ) as unknown as ReturnType<typeof drizzle>;
    }
    const client = postgres(connectionString);
    return drizzle(client, { schema });
})();