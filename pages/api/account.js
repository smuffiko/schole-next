import User from "../../models/User"
import jwt from "jsonwebtoken"
import connectDB from "../../utils/connectDB"
import locales from "../../data/locales.json"
import isEmail from "validator/lib/isEmail"
import isLength from "validator/lib/isLength"
import bcrypt from "bcrypt"

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

const handleGetRequest = async (req, res, t) => {
  if (!("authorization" in req.headers)) {
    return res.status(401).send(t.api.noToken)
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

const handlePutRequest = async (req, res, t) => {
  try {
  if (!("authorization" in req.headers)) {
    return res.status(401).send(t.api.noToken)
  }

  const { name, email, password, password2 } = req.body
  const { userId } = jwt.verify(
    req.headers.authorization,
    process.env.JWT_SECRET
  )
  let message = new Array() 
  const user = await User.findOne({ _id: userId })
  
  // validate name
  if(!isLength(name, { min: 4, max: 30 }))
    message.push(t.api.account.put.nameLength)
  if(!name.match(/^\w+$/))
    message.push(t.api.account.put.nameChars)

  // login and name is not same
  if(user.login.toLowerCase() === name.toLowerCase())
    message.push(t.api.account.put.loginName)
  
  // does email exists?
  if(await User.findOne({ email, _id: { $ne: userId } })) 
    message.push(t.api.account.put.emailExists)
  else {
    // validate email
    if(!isEmail(email))
      message.push(t.api.account.put.email) 
  }

  // check if password are same
  if(password !== password2)
    message.push(t.api.account.put.passwordSame)
    
  // min length of password
  if(!isLength(password, { min: 6 }))
    message.push(t.api.account.put.passwordLength)
    
  // if there is something wrong
  if(message.length !== 0) 
  return res.status(422).send(message.join(" "))

  // if everything is ok hash password
  const hash = await bcrypt.hash(password, 9)
  
  // and update user
  const newUser = await User.findOneAndUpdate(
    { _id: userId },
    { $set: {
      name, email,
      password: hash
    }},
    { new: true }
  )
  return res.status(200).json(newUser)
  } catch(e) { console.log(e.message)}
}