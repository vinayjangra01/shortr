import pkg from 'pg'
import dotenv from 'dotenv'
dotenv.config()


const {Pool} = pkg;


const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
})


// It just prepares a connection pool object that knows how to connect when needed.
pool.on("connect", () => {
    console.log("Connected to postgresSQL")
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client:", err);
});


(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Database connection test successful at:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

export default pool;