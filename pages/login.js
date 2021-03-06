import React from "react"
import Link from "next/link"
import { Form, Message, Segment, Button, Icon, Container } from "semantic-ui-react"
import { handleLogin } from "../utils/auth"
import baseUrl from "../utils/baseUrl"

const INITIAL_USER = {
  login: "",
  password: ""
}

const Login = ({ t, loginUser }) => {
  const [user, setUser] = React.useState(INITIAL_USER)
  const [error, setError] = React.useState("")
  const [disabled, setDisabled] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  
  React.useEffect(()=>{
    if(loginUser) handleLogin(loginUser)
  },[])

  React.useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el))
    isUser ? setDisabled(false) : setDisabled(true)
  }, [user])
  
  const handleChange = event => {
    const { name, value } = event.target
    setUser(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    setError("")
    const url = `${baseUrl}/api/login`
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
      return await response.text()
    }).then(data => {
      handleLogin(data)
    }).catch(error => {
      setError(error.message)  
    }).finally(()=>{
      setLoading(false)
    })
  }

  return (
  <>
    <Container style={{margin:"100px auto"}}>
      <Message
        icon="privacy"
        header={t.login.header}
        content={t.login.content}
        color="orange"
      />
      <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>
        <Message error header={t.error} content={error} />
        <Segment>
          <Form.Input 
            fluid
            icon="user"
            iconPosition="left"
            label={t.login.form.login}
            placeholder={t.login.form.login}
            name="login"
            value={user.login}
            onChange={handleChange}
          />
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            label={t.login.form.password}
            placeholder={t.login.form.password}
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
          />
          <Button
            disabled={disabled || loading}
            icon="signup"
            type="submit"
            color="orange"
            content={t.login.form.submit}
          />
        </Segment>
      </Form>
      <Message attached="bottom" warning>
        <Icon name="help" />
        {t.login.newUser}{" "}
        <Link href="/signup">
          <a>{t.login.signup}</a>
        </Link>
      </Message>
    </Container>
  </>
  )
}
 
export default Login


export const getServerSideProps = async ({query: { confirm, _id }}) => {
  if(!confirm) return { props: {} }

  const url = `${baseUrl}/api/login`
  const payload = { confirm: decodeURIComponent(confirm), _id }
  let token = null
  await fetch(url, {
    method: "PUT",
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
  }).then(data => {
    token = data
  }).catch(error=>{
    console.log(error.message)
  })
  return { props: { loginUser: token } }
}