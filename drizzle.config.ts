import type { Config } from "drizzle-kit";

// Note: We are temporarily hardcoding the URL for debugging.
const DATABASE_URL = "postgresql://neondb_owner:npg_tVUW2L5dFJrE@ep-nameless-scene-a1v0bump-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

export default {
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    driver: 'd1-http', // 'd1-http' is the correct driver type as per Config
    dbCredentials: {
        connectionString: DATABASE_URL,
    },
    verbose: true, // Added for more detailed logs
    strict: true,    // Added for stricter checks
} satisfies Config;
