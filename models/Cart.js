import mongoose from "mongoose"

const { ObjectId } = mongoose.Schema.Types

const CartSchema = new mongoose.Schema({
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
  ]
})

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema)