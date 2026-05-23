import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  idle_timeout: 20,
  max_lifetime: 60 * 30,
});

export default sql;
