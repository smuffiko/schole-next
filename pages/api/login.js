import connectDb from "../../utils/connectDb"
import User from "../../models/User"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

connectDb()

export default async (req, res) => {
  switch(req.method) {
    case "POST":
      await handlePostRequest(req, res)
      break
    default: res.status(405).send(`Method ${req.method} not allowed`)
      break
  }
}

const handlePostRequest = async (req, res) => {  
  const { login, password, t } = req.body

  const user = await User.findOne({ login }).select("+password")
  if (!user) {
    return res.status(404).send(t.login.error.content.notUserExists)
  }
  
  const passwordsMatch = await bcrypt.compare(password, user.password)
  if (passwordsMatch) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    })
    return res.status(200).json(token)
  } else {
    return res.status(401).send(t.login.error.content.passwordsMatch)
  }
}
