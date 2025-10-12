const mongoose = require("mongoose");

const db_connection = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ DataBase connected successfully!.");
  } catch (err) {
    console.error("❌ DataBase connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { db_connection };