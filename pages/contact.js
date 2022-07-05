import React from "react"
import { Container, Form, Segment, Input, TextArea, Message, Button } from "semantic-ui-react"
import baseUrl from "../utils/baseUrl"

const INITIAL_CONTACT_FORM = {
  from: "",
  title: "",
  content: ""
}

const Contact = ({ user, t }) => {
  const [contactForm, setContactForm] = React.useState(user ? { ...INITIAL_CONTACT_FORM, from: user.email} : INITIAL_CONTACT_FORM)
  const [disabledForm, setDisabledForm] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)

  React.useEffect(()=>{
    const delayDebounceFn = setTimeout(() => {
      const isContactForm = Boolean(contactForm.from) && Boolean(contactForm.title) && Boolean(contactForm.content)
      isContactForm ? setDisabledForm(false) : setDisabledForm(true)
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  },[contactForm])

  const handleChange = event => {
    const { name, value } = event.target
    setContactForm(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async()=> {
    setLoading(true)
    setSuccess(false)
    setError("")
    const url = `${baseUrl}/api/email`
    const { from, title, content } = contactForm
    const payload = {
      to: "luckilkaaa@seznam.cz",
      subject: `Scholé contact form - ${title}`,
      replyTo: from,
      text: content
    }
    await fetch(url,{
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(async response=> {
      if(!response.ok) {
        const er = await response.text()
        throw new Error(er)
      }
      return await response.text()
    }).then(data=>{
      console.log(data)
      setContactForm(user ? { ...INITIAL_CONTACT_FORM, from: user.email} : INITIAL_CONTACT_FORM)
      setSuccess(true)
    }).catch(error=>{
      setError(error.message)
    }).finally(()=>{
      setLoading(false)
    })
  }

  return (
    <>
      <Container>
        <Message
          icon="mail"
          header={t.contact.header}
          color="orange"
        />
        <Form
          loading={loading}
          error={Boolean(error)}
          success={success}
          onSubmit={handleSubmit}
        >
          <Message error 
            header={t.error}
            content={error} />
          <Message
            success
            icon="check"
            header={t.contact.success}
          />
          <Segment> 
            <Form.Field
              control={Input}
              name="from"
              label={t.contact.from}
              placeholder={t.contact.from}
              onChange={handleChange}
              value={user ? user.email : contactForm.from}
              type="email"
              disabled={user ? true : false}
              required
            />
            <Form.Field
              control={Input}
              name="title"
              label={t.contact.title}
              placeholder={t.contact.title}
              onChange={handleChange}
              value={contactForm.title}
              required
            />
            <Form.Field
              control={TextArea}
              name="content"
              label={t.contact.content}
              placeholder={t.contact.content}
              onChange={handleChange}
              value={contactForm.content}
              required
            />
            <Form.Field
              control={Button}
              color="orange"
              icon="mail"
              content={t.contact.submit}
              type="submit"
              disabled={disabledForm || loading}
            />
          </Segment>
        </Form>
      </Container>
    </>
  )
}
 
export default Contact