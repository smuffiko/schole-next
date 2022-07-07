import User from "../../models/User"
import jwt from "jsonwebtoken"
import connectDB from "../../utils/connectDB"
import locales from "../../data/locales.json"

connectDB()

export default async function ApiAccount(req, res) {
  const t = locales[req.cookies.local] // setting local file
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res, t)
      break
    case "PUT":
      await handlePutRequest(req, res, t)
      break
    default:
      res.status(405).send(`${t.api.method} ${req.method} ${t.api.notAllowed}`)
      break
  }
}

const handleGetRequest = async(req, res, t) => {
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    )
    const users = await User.find({ _id: { $ne: userId } }).sort({
      role: "asc"
    })
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(403).send("Please login again") // todo
  }
}

const handlePutRequest = async (req, res, t) => {
  const { _id, role } = req.body;
  await User.findOneAndUpdate({ _id }, { role })
  res.status(203).send("User updated") // todo 
}