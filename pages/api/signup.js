import connectDB from "../../utils/connectDB"
import isEmail from "validator/lib/isEmail"
import isLength from "validator/lib/isLength"
import bcrypt from "bcrypt"
import User from "../../models/User"
import baseUrl from "../../utils/basseUrl"

connectDB()

export default async function ApiSignup(req, res){
  switch(req.method) {
    case "POST":
      await handlePostRequest(req, res)
      break
    default: res.status(405).send(`Method ${req.method} not allowed`)
      break
  }
}

const handlePostRequest = async (req, res) => {
  const { name, login, email, password, password2, agree, t } = req.body
  let message = new Array()
  const regExLetterNumber = /^[0-9a-zA-Z]+$/
  
  // does name exists?
  if(await User.findOne({ name }))
    message.push(t.signup.error.content.nameExists)
  else {
    // validate name
    if(!isLength(name, { min: 4, max: 30 }))
      message.push(t.signup.error.content.nameLength)
    if(!name.match(regExLetterNumber))
      message.push(t.signup.error.content.nameChars)
  }
  
  // does login exists? 
  if(await User.findOne({ login }))
    message.push(t.signup.error.content.loginExists)
  else {
    // validate login
    if(!isLength(login, { min: 4, max:30 }))
      message.push(t.signup.error.content.loginLength)
    if(!login.match(regExLetterNumber))
      message.push(t.signup.error.content.loginChars)
  }

  // login and name is not same
  if(login.toLowerCase() === name.toLowerCase())
    message.push(t.signup.error.content.loginName)

    
  // does email exists? todo
  if(await User.findOne({ email }))
    message.push(t.signup.error.content.emailExists)
  else {
    // validate email
    if(!isEmail(email))
      message.push(t.signup.error.content.email)
  }
  
  // check if password are same
  if(password !== password2)
    message.push(t.signup.error.content.passwordSame)

  // min length of password
  if(!isLength(password, { min: 6 }))
    message.push(t.signup.error.content.passwordLength)

  // is agree checked
  if(!agree)
    message.push(t.signup.error.content.agreeCheck)

  // if there is something wrong
  if(message.length !== 0)
    return res.status(422).send(message)

  // registration ok -> todo
  // hash password
  const hash = await bcrypt.hash(password, 9)

  // create user
  const newUser = await new User({
    name,
    login: login.toLowerCase(),
    email,
    password: hash
  }).save()

  // create cart for new user

  
  res.status(201).json({newUser})

  // send back email and link todo
  /*const { _id, createdAt } = await User.findOne({ email })
  const link = `${baseUrl}/login?new=${await bcrypt.hash(_id + createdAt, 9)}`
  res.status(201).json({ link, name })*/
}