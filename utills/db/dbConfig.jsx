//postgresql://vewaste_owner:6CcugkOjbN8Z@ep-blue-boat-a1j7f54e.ap-southeast-1.aws.neon.tech/vewaste?sslmode=require

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon("postgresql://vewaste_owner:6CcugkOjbN8Z@ep-blue-boat-a1j7f54e.ap-southeast-1.aws.neon.tech/vewaste?sslmode=require");
export const db = drizzle(sql, { schema });