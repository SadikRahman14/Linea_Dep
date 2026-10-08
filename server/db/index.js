import mongoose from "mongoose";

const connectDB = async () => {
  const databaseUri = process.env.DATABASE_URI;
  if (!databaseUri) throw new Error("DATABASE_URI is missing");

  // Pass the Atlas URI unchanged: appending /linea after its query string breaks it.
  const connection = await mongoose.connect(databaseUri, { dbName: "linea" });
  console.log(`MongoDB connected to ${connection.connection.host}`);
};

export default connectDB;
