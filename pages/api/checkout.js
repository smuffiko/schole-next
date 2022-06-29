import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import Cart from "../../models/Cart"
import Order from "../../models/Order"
import connectDb from "../../utils/connectDB"
import locales from "../../data/locales.json"
import Stripe from "stripe"
import calculateCartTotal from "../../utils/calculateCartTotal"

connectDb()

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const { ObjectId } = mongoose.Types

export default async function ApiCart(req, res) {
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
  const { paymentData } = req.body
  try {
    // verify and get userId
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    )
    
    // find cart
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "packs.pack",
      model: "Pack"
    })

    // calculate price again
    const { cartTotal, stripeTotal } = calculateCartTotal(cart.packs.map(p => p.pack))

    // get email from payment, check customer
    const prevCustomer = await stripe.customers.list({
      email: paymentData.email,
      limit: 1
    })
    const isExistingCustomer = prevCustomer.data.length > 0

    // create new customer
    let newCustomer
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentData.email,
        source: paymentData.id
      })
    }
    const customer = (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id

    // create charge with total, send email
    const charge = await stripe.charges.create(
      {
        currency: "czk",
        amount: stripeTotal,
        receipt_email: paymentData.email,
        customer,
        description: `Checkout | ${paymentData.email} | ${paymentData.id}`
      }
    )
    
    // add order data to database
    await new Order({
      user: userId,
      email: paymentData.email,
      total: cartTotal,
      packs: cart.packs
    }).save()

    // delete cart
    await Cart.findOneAndUpdate({ _id: cart._id }, { $set: { packs: [] } })

    // 9) Send back success (200) response
    res.status(200).send("Checkout successful")

  } catch (error) {
    console.error(error.message)
    res.status(500).send("Error processing charge")
  }
}