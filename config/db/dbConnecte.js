import mongoose from "mongoose";

let isConnected = false;

const dbConnected = async () => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.DB_URL);

    isConnected = conn.connections[0].readyState === 1;

    console.log(
      `✅ DB Connected: ${conn.connection.host}:${conn.connection.port}`
    );
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    throw new Error("Database connection failed"); // ✅ don't exit
  }
};

export default dbConnected;