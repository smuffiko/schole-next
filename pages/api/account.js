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
      break;
    default:
      res.status(405).send(`${t.api.method} ${req.method} ${t.api.notAllowed}`)
      break;
  }
}

const handleGetRequest = async (req, res, t) => {
  if (!("authorization" in req.headers)) {
    return res.status(401).send(t.api.account.get.noToken)
  }
  const { userId } = jwt.verify(
    req.headers.authorization,
    process.env.JWT_SECRET
  )
  const user = await User.findOne({ _id: userId })
  if (user) {
    res.status(200).json(user)
  } else {
    res.status(404).send(t.api.account.get.userNotFound)
  }
}