import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import Cart from "../../models/Cart"
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
    case "PUT":
      await handlePutRequest(req, res, t)
      break
    case "DELETE":
      await handleDeleteRequest(req, res, t)
      break
    default:
      res.status(405).send(`${t.api.method} ${req.method} ${t.api.notAllowed}`)
      break
  }
}

const handleGetRequest = async(req, res, t) => {
  if (!("authorization" in req.headers)) {
    return res.status(401).send(t.api.noToken)
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    )
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "packs.pack",
      model: "Pack"
    })
    res.status(200).json(cart.packs)
  } catch (error) {
    console.error(error)
    res.status(403).send(t.api.loginAgain)
  }
}

const handlePutRequest = async(req, res, t) => {
  const { pack } = req.body
  if (!("authorization" in req.headers)) {
    return res.status(401).send(t.api.noToken)
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    )
    // Get user cart based on userId
    const cart = await Cart.findOne({ user: userId })
    // Check if pack already exists in cart
    const packExists = cart.packs.some(doc =>
      ObjectId(pack).equals(doc.pack)
    )
    // if pack doesnt exists in cart, add it to cart
    if (!packExists) {
      const newCart = await Cart.findOneAndUpdate(
        { _id: cart._id },
        { $addToSet: { packs: { pack: pack } } },
        { new: true }
      )
      res.status(200).json(newCart)
    } else res.status(200).json(cart)
  } catch (error) {
    console.error(error);
    res.status(403).send(t.api.loginAgain)
  }
}

const handleDeleteRequest = async(req, res, t) => {
  const { pack } = req.query
  if (!("authorization" in req.headers)) {
    return res.status(401).send(t.api.noToken)
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    )
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { packs: { pack: pack } } },
      { new: true }
    ).populate({
      path: "packs.pack",
      model: "Pack"
    })
    res.status(200).json(cart.packs)
  } catch (error) {
    console.error(error);
    res.status(403).send(t.api.loginAgain)
  }
}