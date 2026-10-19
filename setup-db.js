const { Client } = require('pg');
const fs = require('fs');

async function run() {
  console.log('Reading UNIVERSAL_FINAL_SCHEMA.sql...');
  const sql = fs.readFileSync('UNIVERSAL_FINAL_SCHEMA.sql', 'utf8');

  // Database connection string from environment or placeholder
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:your_password@db.your_project.supabase.co:5432/postgres';

  let client = new Client({ 
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log(`Trying to connect via IPv4 Pooler to ${projectId}...`);
    await client.connect();
    console.log('✅ Connected successfully!');
    
    console.log('⏳ Executing schema creation... This may take a moment.');
    await client.query(sql);
    console.log('🎉 SCHEMA EXECUTED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Database connection failed. Error:', err.message);
    console.error('Please verify your DATABASE_URL environment variable.');
  } finally {
    await client.end().catch(() => {});
  }
}

run();
