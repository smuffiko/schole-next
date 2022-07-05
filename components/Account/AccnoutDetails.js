import React from "react"
import { Form, Segment, Input, Button, Message } from "semantic-ui-react"
import baseUrl from "../../utils/baseUrl"
import cookie from "js-cookie"

const AccountDetails = ({ user, t }) => {
  const [showUser, setShowUser] = React.useState({ email: user.email, name: user.name, password: "", password2: "" })
  const [disabled, setDisabled] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)

  React.useEffect(()=>{
    const isUser = Boolean(showUser.email) && Boolean(showUser.name) && Boolean(showUser.password) && Boolean(showUser.password2)
    isUser ? setDisabled(false) : setDisabled(true)
  },[showUser])

  const handleChange = event => {
    const { name, value } = event.target
    setShowUser(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError("")
    setLoading(true)
    setDisabled(true)

    const url = `${baseUrl}/api/account`
    const { email, name, password, password2 } = showUser
    const payload = { email, name, password, password2 }
    const token = cookie.get("token")
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(payload)
    }).then(async response=> {
      if(!response.ok) {
        const er = await response.text()
        throw new Error(er)
      }
      return response.text()
    }).then(()=>{
      setSuccess(true)
    }).catch(error=>{
      setError(error.message)
    }).finally(()=>{
      setLoading(false)
    })
  }

  return (
    <>
      <Form
        loading={loading}
        error={Boolean(error)}
        onSubmit={handleSubmit}
        success={success}
      >
        <Message error 
          header={t.error}
          content={error} />
        <Message
          success
          icon="check"
          header={t.account.success}
        />
        <Segment>
          <Form.Group
            widths="equal"
          >
            <Form.Field
              control={Input}
              name="name"
              label={t.account.name}
              placeholder={t.account.name}
              onChange={handleChange}
              value={showUser.name}
            />
            <Form.Field
              control={Input}
              name="email"
              label={t.account.email}
              placeholder={t.account.email}
              onChange={handleChange}
              value={showUser.email}
              type="email"
            />
          </Form.Group>
          <Form.Group
            widths="equal"
          >
            <Form.Field
              control={Input}
              name="password"
              label={t.account.password}
              placeholder={t.account.password}
              onChange={handleChange}
              value={showUser.password}
              type="password"
            />
            <Form.Field
              control={Input}
              name="password2"
              label={t.account.password2}
              placeholder={t.account.password2}
              onChange={handleChange}
              value={showUser.password2}
              type="password"
            />
          </Form.Group>
          <Form.Field
            control={Button}
            color="orange"
            icon="pencil"
            content={t.account.save}
            type="submit"
            disabled={disabled || loading}
          />
        </Segment>
      </Form>
    </>
  )
}
 
export default AccountDetails;