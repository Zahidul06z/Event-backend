import mongoose from "mongoose";

// let isConnected = false

const dbConnected = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        // isConnected = true;

        console.log(`✅ DB Connected: ${conn.connection.host}:${conn.connection.port}`);
    } catch (error) {
        console.error("❌ DB Connection Error:", error.message);
        process.exit(1); // Optional: exit process on DB failure
    }
};

export default dbConnected;
