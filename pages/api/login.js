import connectDB from "../../utils/connectDB"
import User from "../../models/User"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import locales from "../../data/locales.json"

connectDB()

export default async function ApiLogin(req, res) {
  const t = locales[req.cookies.local] // setting local file
  switch(req.method) {
    case "POST":
      await handlePostRequest(req, res, t)
      break
    default:
      res.status(405).send(`${t.api.method} ${req.method} ${t.api.notAllowed}`)
      break
  }
}

const handlePostRequest = async (req, res, t) => {  
  const { login, password } = req.body

  const user = await User.findOne({ login }).select("+password")
  if (!user) {
    return res.status(404).send(t.api.login.post.notUserExists)
  }
  
  const passwordsMatch = await bcrypt.compare(password, user.password)
  if (passwordsMatch) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    })
    return res.status(200).json(token)
  } else {
    return res.status(401).send(t.api.login.post.wrongPassword)
  }
}
