import mongoose from "mongoose"

const { String } = mongoose.Schema.Types

const ArticleSchema = new mongoose.Schema(
  {
    title: {
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
    }
  },
  {
    timestamps: true
  }
)
 
export default mongoose.models.Article || mongoose.model("Article", ArticleSchema)