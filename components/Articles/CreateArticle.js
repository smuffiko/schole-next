import React from "react"
import { Button, Container, Form, Header, Input, Message, Segment, Select, TextArea } from "semantic-ui-react"
import baseUrl from "../../utils/baseUrl"
import cookies from "js-cookie"
import { parseCookies } from "nookies"

const INITIAL_ARTICLE = {
  title: "",
  content: "",
  lang: ""
}

const CreateArticle = ({t}) => {
  const [article, setArticle] = React.useState(INITIAL_ARTICLE)
  const [disabled, setDisabled] = React.useState(true)
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const options = [
    {
      key: "cz",
      value: "cz",
      text: "Česky",
      flag: "cz"
    },
    {
      key: "en",
      value: "en",
      text: "English",
      flag: "gb"
    }
  ]

  React.useEffect(()=>{
    const isArticle = Object.values(article).every(el => Boolean(el))
    isArticle ? setDisabled(false) : setDisabled(true)
  },[article])

  const handleChange = (event, { value }) => {
    let name
    if(event.target.name) name  = event.target.name
    else name = "lang"
    setArticle(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    setError("")
    const url = `${baseUrl}/api/article`
    const { title, content, lang } = article
    const payload = { title, content, lang }
    await fetch(url,{
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
    }).then(data => {
      setArticle(INITIAL_ARTICLE)
      setSuccess(true)
    }).catch(error=>{
      setError(error.message)
    })
    .finally(()=>{
      setLoading(false)
    })
  }

  return (
    <>
      <Container>
        <Message
          attached
          icon="pencil"
          header={t.article.create.header}
          color="orange"
        />
        <Segment>
          <Form
            loading={loading}
            error={Boolean(error)}
            success={success}
            onSubmit={handleSubmit}
          >
            {/* needtest - error message */}
            <Message error 
              header={t.error}
              content={error} />
            <Message
              success
              icon="check"
              header={t.article.create.success}
            />
            <Form.Dropdown
              selection
              name="lang"
              label={t.article.create.selectLanguage}
              placeholder={t.article.create.language}
              options={options}
              onChange={handleChange}
            />
            <Form.Field
              control={Input}
              name="title"
              label={t.article.create.title}
              placeholder={t.article.create.title}
              onChange={handleChange}
              value={article.title}
            />
            <Form.TextArea
              control={TextArea}
              name="content"
              label={t.article.create.content}
              placeholder={t.article.create.content}
              onChange={handleChange}
              value={article.content}
            />
            <Form.Field
              control={Button}
              color="orange"
              icon="pencil"
              content={t.article.create.submit}
              type="submit"
              disabled={disabled || loading}
            />
          </Form>
        </Segment>
      </Container>
    </>
  )
}
 
export default CreateArticle