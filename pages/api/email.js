import locales from "../../data/locales.json"
import nodemailer from "nodemailer"

export default async function ApiEmail(req, res) {
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

const handlePostRequest = async (req, res) => {
  const { fromName, fromEmail, to, subject, html} = req.body

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME, 
      pass: process.env.EMAIL_PASSWORD, 
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: to, 
    subject: subject,
    html: html
  })

  res.status(200).send("Email sent successfully.") // todo local
}