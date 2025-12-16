
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("🔧 Adding 'error' column to colony_tasks...");

        await pool.query(`
            ALTER TABLE colony_tasks 
            ADD COLUMN IF NOT EXISTS error text;
        `);
        console.log("✅ Added error column");
    } catch (err) {
        console.error("❌ Schema Fix Failed:", err);
    } finally {
        pool.end();
    }
}
run();
