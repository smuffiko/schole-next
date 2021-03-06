import connectDB from "../../utils/connectDB"
import Article from "../../models/Article"
import locales from "../../data/locales.json"

connectDB()

export default async function ApiArticle(req, res) {
  const t = locales[req.cookies.local] // setting local file
  switch(req.method) {
    case "GET":
      await handleGetRequest(req, res)
      break
    case "POST":
      await handlePostRequest(req, res)
      break
    case "PUT":
      await handlePutRequest(req, res)
      break
    case "DELETE":
      await handleDeleteRequest(req, res)
      break
    default:
      res.status(405).send(`${t.api.method} ${req.method} ${t.api.notAllowed}`)
      break
  }
}

const handleGetRequest = async (req, res) => {
  const { _id } = req.query
  const article = await Article.findOne({ _id })
  res.status(200).json(article)
}

const handlePostRequest = async (req, res) => {
  const { title, content, lang, videoUrl, description } = req.body
  const video = videoUrl ? videoUrl : null
  const newArticle = await new Article({
    title,
    description,
    content,
    video,
    language: lang
  }).save()
  res.status(201).json(newArticle)
}

const handlePutRequest = async (req, res) => {
  const { _id, title, description, content } = req.body
  const article = await Article.findOneAndUpdate({ _id }, { title, description, content }, { new: true })
  res.status(203).json(article)
}

const handleDeleteRequest = async (req, res) => {
  const { _id } = req.query
  try {
    await Article.findOneAndDelete({ _id }) // delete article by id
    /* // delete recursive from packs and cart
    TODO
    await Cart.updateMany(
      { "articles.article": _id },
      { $pull: { articles: { article: _id } } }
    )
    */
    res.status(204).json({})
  } catch (error) {
    console.error(error)
    res.status(500).send("Error deleting article") // todo local
  }
}