import React from "react"
import { Message, Icon, Form, Button, Segment, Container } from "semantic-ui-react"
import Link from "next/link"
import baseUrl from "../utils/basseUrl"

const INITIAL_USER = {
  name: "",
  login: "",
  email: "",
  password: "",
  password2: "",
  agree: false
}

const Signup = ({ t }) => {
  const [user, setUser] = React.useState(INITIAL_USER)
  const [disabled, setDisabled] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState()

  React.useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el))
    isUser ? setDisabled(false) : setDisabled(true)
  }, [user]);

  const handleChange = (event, data) => {
    const { name, value } = event.target
    if(name===undefined){
      name = "agree"
      value = data.checked
    } 
    setUser(prevState => ({ ...prevState, [name]: value }))
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
        const er = await response.text()
        throw new Error(er)
      }
      return response.json()
    })
    .then(data =>{
      // todo send email and confirm registration
    })
    .catch(error=>{
      const e = error.message.substring(2, error.message.length-2).split('","')
      setError(e)
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
        <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>
          <Message error>
            <Message.Header content={t.signup.error.header} />
            <Message.List>
            {error && (Object.keys(error).map((key, index)=>
              <Message.Item key={key}>
                {error[key]}
              </Message.Item>
            ))}
            </Message.List>
          </Message>
          <Message success content={t.signup.success}/>
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