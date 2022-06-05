import React from "react"
import Router, { useRouter } from "next/router"
import { Message, Icon, Form, Button, Segment, Container } from "semantic-ui-react"
import Link from "next/link"
import baseUrl from "../utils/baseUrl"
import { redirectUser } from "../utils/auth"

const INITIAL_USER = {
  name: "",
  login: "",
  email: "",
  password: "",
  password2: "",
  agree: false
}

const Signup = ({ t }) => {
  const router = useRouter()
  const [user, setUser] = React.useState(INITIAL_USER)
  const [disabled, setDisabled] = React.useState(true)
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el))
    isUser ? setDisabled(false) : setDisabled(true)
  }, [user]);

  const handleChange = (event, data) => {
    const { name, value } = event.target
    let n = name
    let val = value
    if(n===undefined){
      n = "agree"
      val = data.checked
    } 
    setUser(prevState => ({ ...prevState, [n]: val }))
  }
  
  const handleSubmit = async(event) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    const url = `${baseUrl}/api/signup`
    const payload = { ...user, t }

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(async response => {
      if(!response.ok) {
        throw new Error(await response.text())
      }
      return response.json()
    })
    .then(data =>{
      // todo send email and confirm registration
      setSuccess(true)
      setTimeout(()=>{redirectUser(null, "/login")},5000)
    })
    .catch(error=>{
      setError(error.message)
    })
    .finally(()=>{
      setLoading(false)
    })
  }

  return (
    <>
      <Container style={{margin:"100px auto"}}>
        <Message
          attached
          icon="settings"          
          header={t.signup.header}
          content={t.signup.content}
          color="orange"
          style={{ width: "100%"}}
        />      
        <Form error={Boolean(error)} loading={loading} success={success} onSubmit={handleSubmit}>
          <Message error>
            <Message.Content>
              <Message.Header content={t.error} />
              {error.split(".").map(e => <div key={e}>{e}</div>)}
            </Message.Content>
          </Message>
          <Message success icon>
            <Icon name="check" />
            <Message.Content>
              <Message.Header content={t.signup.success.header} />
              {t.signup.success.content}{" "}
              <Link href="/login">
                <a>{t.signup.success.link}</a>
              </Link>
            </Message.Content>
          </Message>
          <Segment>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              label={t.signup.form.login}
              placeholder={t.signup.form.login}
              name="login"
              onChange={handleChange}
            />
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              label={t.signup.form.name}
              placeholder={t.signup.form.name}
              name="name"
              onChange={handleChange}
            />
            <Form.Input
              fluid
              icon="envelope"
              iconPosition="left"
              label={t.signup.form.email}
              placeholder={t.signup.form.email}
              name="email"
              type="email"
              onChange={handleChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              label={t.signup.form.password}
              placeholder={t.signup.form.password}
              name="password"
              type="password"
              onChange={handleChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              label={t.signup.form.password2}
              placeholder={t.signup.form.password2}
              name="password2"
              type="password"
              onChange={handleChange}
            />
            <Form.Checkbox
              label={t.signup.form.agree}
              name="agree"
              onClick={(evt, data)=>handleChange(evt, data)}
            />
            <Button
              disabled={disabled || loading}
              icon="signup"
              type="submit"
              color="orange"
              content={t.signup.form.signup}
            />
          </Segment>
        </Form>    
        <Message attached="bottom" warning>
          <Icon name="help" />
          {t.signup.exists}{" "}
          <Link href="/login">
            <a>{t.signup.login}</a>
          </Link>
        </Message>
      </Container>
    </>
  )
}
 
export default Signup