import Pack from "../../models/Pack"
import connectDB from "../../utils/connectDB"
import locales from "../../data/locales.json"

connectDB()

export default async function ApiPacks(req, res) {
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
  const packs = await Pack.find().sort({createdAt: -1})
  res.status(200).json(packs)
}