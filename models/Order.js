import mongoose from "mongoose"

const { ObjectId, Number } = mongoose.Schema.Types

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User"
    },
    packs: [
      {
        pack: {
          type: ObjectId,
          ref: "Pack"
        }
      }
    ],
    email: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Order || mongoose.model("Order", OrderSchema)
