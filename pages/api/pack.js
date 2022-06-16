import connectDB from "../../utils/connectDB"
import Pack from "../../models/Pack"
import locales from "../../data/locales.json"

connectDB()

export default async function ApiPack(req, res) {
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
  const pack = await Pack.findOne({ _id })
  res.status(200).json(pack)
}

const handlePostRequest = async (req, res) => {
  const { title, content, lang } = req.body
  const newPack = await new Pack({
    title,
    content,
    language: lang
  }).save()
  res.status(201).json({newPack})
}

const handlePutRequest = async (req, res) => {
  const { _id, title, content } = req.body
  const pack = await Pack.findOneAndUpdate({ _id }, { title, content }, { new: true })
  res.status(203).json(pack)
}

const handleDeleteRequest = async (req, res) => {
  const { _id } = req.query
  try {
    await Pack.findOneAndDelete({ _id }) // delete pack by id
    /* // delete recursive from packs and cart
    TODO
    await Cart.updateMany(
      { "articles.article": _id },
      { $pull: { articles: { article: _id } } }
    )
    */
    res.status(204).json({})
  } catch (error) {
    res.status(500).send("Error deleting pack") // todo local
  }
}