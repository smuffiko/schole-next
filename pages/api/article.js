import connectDB from "../../utils/connectDB"
import Article from "../../models/Article"
import locales from "../../data/locales.json"

connectDB()

export default async function ApiArticle(req, res) {
  const t = locales[req.cookies.local] // setting local file
  switch(req.method) {
    case "POST":
      await handlePostRequest(req, res)
      break
    default:
      res.status(405).send(`${t.api.method} ${req.method} ${t.api.notAllowed}`)
      break
  }
}

const handlePostRequest = async (req, res) => {
  const { title, content, lang } = req.body
  const newArticle = await new Article({
    title,
    content,
    language: lang
  }).save()
  res.status(201).json({newArticle})
}