import mongoose from "mongoose"

const { String } = mongoose.Schema.Types

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    login: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      required: true,
      default: "new",
      enum: ["new", "user", "admin", "root"]
    }
  },
  {
    timestamps: true
  }
)
 
export default mongoose.models.User || mongoose.model("User", UserSchema)