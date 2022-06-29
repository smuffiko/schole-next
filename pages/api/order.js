import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import Order from "../../models/Order"
import connectDb from "../../utils/connectDB"
import locales from "../../data/locales.json"

connectDb()

const { ObjectId } = mongoose.Types

export default async function ApiCart(req, res) {
  const t = locales[req.cookies.local] // setting local file
  switch(req.method) {
    case "GET":
      await handleGetRequest(req, res, t)
      break
    default:
      res.status(405).send(`${t.api.method} ${req.method} ${t.api.notAllowed}`)
      break
  }
}

const handleGetRequest = async (req, res, t) => {
  if (!("authorization" in req.headers)) {
    return res.status(401).send(t.api.noToken)
  }
  const { userId } = jwt.verify(
    req.headers.authorization,
    process.env.JWT_SECRET
  )
  const orders = await Order.find({ user: userId}).populate({
    path: "packs.pack",
    model: "Pack",
    populate: {
      path: "articles.article",
      model: "Article"
    }
  })
  
  // ... idk, just some mapping etc (todo maybe do it prettier)
  let boughtPacks = orders.map(o=>o.packs.map(p=>p.pack)).flat()
  boughtPacks = Array.from(new Set(boughtPacks.map(a => a._id))).map(id => boughtPacks.find(a => a._id === id))
  let boughtArticles = boughtPacks.map(p=>p.articles).flat().map(a=>a.article)
  boughtArticles = Array.from(new Set(boughtArticles.map(a => a._id))).map(id => boughtArticles.find(a => a._id === id))

  res.status(200).json({ boughtPacks, boughtArticles })
}