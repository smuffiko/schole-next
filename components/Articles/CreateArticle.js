import React from "react"
import { Button, Container, Form, Input, Message, Segment, TextArea } from "semantic-ui-react"
import baseUrl from "../../utils/baseUrl"

import RichTextEditor from '../_App/RichTextEditor'

const INITIAL_ARTICLE = {
  title: "",
  content: "",
  lang: ""
}

const CreateArticle = ({ setNewArticles, t }) => {
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
  const editorOptions = [
    ["bold", "italic", "underline", "strike"],
    ["h1", "h2", "h3", "h4", "h5", "h6"],
    ["unorderedList", "orderedList"],
    ["alignCenter", "alignLeft","alignRight"],
    ["link", "blockquote"],
    // ["link", "image", "video", "blockquote"], // TODO upload
    ["clean"]
  ]

  React.useEffect(()=>{
    const delayDebounceFn = setTimeout(() => {
      const isArticle = Object.values(article).every(el => Boolean(el)) && article.content !== "<p><br></p>"
      isArticle ? setDisabled(false) : setDisabled(true)
      console.log(article)
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  },[article])

  const handleChange = (event, { value }) => {
    let name
    if(event.target.name) name = event.target.name  // if target is base input
    else name = "lang"  // if target is select -> set lang
    setArticle(prevState => ({ ...prevState, [name]: value }))
  } 

  const handleChangeEditor = val => {
    if(val) setArticle(prevState => ({ ...prevState, content: val }))
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
      setNewArticles(prevState=> [data.newArticle, ...prevState])
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
          icon="pencil"
          header={t.article.create.header}
          color="orange"
        />
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
          <Segment>
            <Form.Dropdown
              selection
              name="lang"
              label={t.article.create.selectLanguage}
              placeholder={t.article.create.language}
              value={article.lang}
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
            <Form.Field>
              <label>{t.article.create.content}</label>
              <RichTextEditor
                radius="md"
                value={article.content}
                onChange={(val) => handleChangeEditor(val)}
                controls={editorOptions}
              />
            </Form.Field>
            <Form.Field
              control={Button}
              color="orange"
              icon="pencil"
              content={t.article.create.submit}
              type="submit"
              disabled={disabled || loading}
            />
          </Segment>
        </Form>
      </Container>
    </>
  )
}
 
export default CreateArticle