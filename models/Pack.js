import mongoose from "mongoose"

const { ObjectId, String } = mongoose.Schema.Types

const PackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["cz", "en"]
    },
    articles: [
      {
        article: {
          type: ObjectId,
          ref: "Article"
        }
      }
    ]
  },
  {
    timestamps: true
  }
)
 
export default mongoose.models.Pack || mongoose.model("Pack", PackSchema)