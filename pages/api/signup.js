import connectDB from "../../utils/connectDB"
import isEmail from "validator/lib/isEmail"
import isLength from "validator/lib/isLength"
import bcrypt from "bcrypt"
import User from "../../models/User"
import Cart from "../../models/Cart"
import locales from "../../data/locales.json"

connectDB()

export default async function ApiSignup(req, res){
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
  const { name, login, email, password, password2, agree} = req.body
  let message = new Array() 
  
  // validate name
  if(!isLength(name, { min: 4, max: 30 }))
    message.push(t.api.signup.post.nameLength)
  if(!name.match(/^\w+$/))
    message.push(t.api.signup.post.nameChars)
  
  // does login exists? 
  if(await User.findOne({ login }))
    message.push(t.api.signup.post.loginExists)
  else {
    // validate login
    if(!isLength(login, { min: 4, max:30 }))
      message.push(t.api.signup.post.loginLength)
    if(!login.match(/^[0-9a-zA-Z]+$/ ))
      message.push(t.api.signup.post.loginChars)
  }

  // login and name is not same
  if(login.toLowerCase() === name.toLowerCase())
    message.push(t.api.signup.post.loginName)

    
  // does email exists?
  if(await User.findOne({ email }))
    message.push(t.api.signup.post.emailExists)
  else {
    // validate email
    if(!isEmail(email))
      message.push(t.api.signup.post.email)
  }
  
  // check if password are same
  if(password !== password2)
    message.push(t.api.signup.post.passwordSame)

  // min length of password
  if(!isLength(password, { min: 6 }))
    message.push(t.api.signup.post.passwordLength)

  // is agree checked
  if(!agree)
    message.push(t.api.signup.post.agreeCheck)

  // if there is something wrong
  if(message.length !== 0) 
    return res.status(422).send(message.join(" "))
    
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
  await new Cart({ user: newUser._id}).save()
  
  // hash for confirm email
  const emailHash = await bcrypt.hash(newUser.email+newUser.updatedAt, 6)

  res.status(201).json({ newUser, emailHash })
}