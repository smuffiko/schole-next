import mongoose from "mongoose"
require("../models/Article")
require("../models/Cart")
require("../models/Pack")
require("../models/User")

const connection = {}

async function connectDB() {
  if (connection.isConnected) {
    // Use existing database connection
    console.log("Using existing connection")
    return
  }
  // Use new database connection
  const db = await mongoose.connect(process.env.MONGO_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("DB Connected")
  connection.isConnected = db.connections[0].readyState
}

export default connectDB