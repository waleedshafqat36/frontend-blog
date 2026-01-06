import mongoose  from "mongoose";

const MONGO_URI = process.env.MONGO_URL

if (!MONGO_URI) {
  throw new Error("please define mongodb uri in env file");
}
let cached = (global as any).mongoose;
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

export async function ConnectDB() {
  if (cached.conn) return cached.conn;

if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise =  mongoose.connect(MONGO_URI!,opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully"); // <-- Connection success log
        return mongoose.connection;
      })
      .catch((e) => {
        console.error(" MongoDB connection error:", e);
        throw e; // Throw so API knows connection failed
      });
     
}
 
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default ConnectDB;