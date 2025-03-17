import mysql from 'mysql2/promise';

// Validate environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, // Maximum number of connections in the pool
  waitForConnections: true, // Wait for a connection if none are available
  queueLimit: 0, // Unlimited queueing for connection requests
  idleTimeout: 60000, // Close idle connections after 60 seconds
});

// Test the database connection
pool.getConnection()
  .then((connection) => {
    console.log('Database connected successfully');
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the process if the database connection fails
  });

// Export the connection pool
export default pool;