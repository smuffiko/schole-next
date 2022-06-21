import mongoose from "mongoose"

const { String } = mongoose.Schema.Types

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
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
    video: {
      type: String,
      required: false,
      default: null
    }
  },
  {
    timestamps: true
  }
)
 
export default mongoose.models.Article || mongoose.model("Article", ArticleSchema)