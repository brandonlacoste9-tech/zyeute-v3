import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const { Pool } = pg;

// Parse the DATABASE_URL to swap port 6543 for 5432
let dbUrl = process.env.DATABASE_URL || '';
if (dbUrl.includes(':6543')) {
    console.log("Found port 6543, swapping to 5432 (Direct connection)...");
    dbUrl = dbUrl.replace(':6543', ':5432');
}

const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    console.log("Trying connection to:", dbUrl.split('@')[1]); // Log host part only
    try {
        console.log("🔍 Testing connection...");
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Connection successful:', res.rows[0]);

        console.log("🔍 Checking user_profiles columns...");
        const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_profiles';
    `);

        columns.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));

    } catch (err: any) {
        console.error('❌ Error:', err.message);
        if (err.message.includes('Tenant or user not found')) {
            console.error('Significant Error: Supabase connection pooler says project not found. Is it paused?');
        }
    } finally {
        pool.end();
    }
}
run();
