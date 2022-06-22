import Article from "../../models/Article"
import connectDB from "../../utils/connectDB"
import locales from "../../data/locales.json"

connectDB()

export default async function ApiArticles(req, res) {
  const t = locales[req.cookies.local] // setting local file
  switch(req.method) {
    case "GET":
      await handleGetRequest(req, res)
      break
    default:
      res.status(405).send(`${t.api.method} ${req.method} ${t.api.notAllowed}`)
      break
  }
}

const handleGetRequest = async (req, res) => {
  const { language } = req.query
  
  const articles = language===undefined ? 
    await Article.find().sort({createdAt: -1})
    : await Article.find({language}).sort({createdAt: -1})
  res.status(200).json(articles)
}