import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import config from "@/lib/config";
const sql = neon(config.env.databseUrl!);
export const db = drizzle({ client: sql });
