import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://pallab:3qZeLDPjJtfMdXdF@namastenode.mwxbx.mongodb.net/devTinder", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if connection fails
  }
};

export default connectDB; // Default export for ES module

