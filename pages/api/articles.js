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
  const { size, page } = req.query
  const pageNum = Number(page)
  const sizeNum = Number(size)
  let articles = []
  const totalDocs = await Article.countDocuments()
  const totalPages = Math.ceil(totalDocs/sizeNum)
  if(pageNum===1) {
    articles = await Article.find()
      .sort({createdAt: -1})
      .limit(sizeNum)
  } else {
    const skips = sizeNum * (pageNum - 1)
    articles = await Article.find()
      .sort({createdAt: -1})
      .skip(skips)
      .limit(sizeNum)
  }
  
  res.status(200).json({ articles, totalPages })
}