import connectDB from "../../utils/connectDB"
import Article from "../../models/Article"

connectDB()

export default async function ApiArticle(req, res) {
  switch(req.method) {
    case "POST":
      await handlePostRequest(req, res)
      break
    default: res.status(405).send(`Method ${req.method} not allowed`)
      break
  }
}

const handlePostRequest = async (req, res) => {
  const { title, content, lang, t } = req.body
  console.log(title, content, lang)
  const newArticle = await new Article({
    title,
    content,
    language: lang
  }).save()
  res.status(201).json({newArticle})
}