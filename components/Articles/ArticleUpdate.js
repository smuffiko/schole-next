import React from "react"
import { useRouter } from "next/router"
import { Form, Button, Segment, Input, Message } from "semantic-ui-react"
import RichTextEditor from "../_App/RichTextEditor"
import baseUrl from "../../utils/baseUrl"

const ArticleUpdate = ({ article, setShowArticle, t }) => {
  const [updatedArticle, setUpdatedArticle] = React.useState({
    title: article.title,
    content: article.content
  })
  const [disabled, setDisabled] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("") 
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
    const isArticle = Object.values(updatedArticle).every(el => Boolean(el))
    isArticle ? setDisabled(false) : setDisabled(true)
  },[updatedArticle])

  const handleChange = (event, { value }) => {
    let name
    if(event.target.name) name = event.target.name  // if target is base input
    else name = "lang"  // if target is select -> set lang
    setUpdatedArticle(prevState => ({ ...prevState, [name]: value }))
  } 
  const handleChangeEditor = val => {
    setUpdatedArticle(prevState => ({ ...prevState, content: val.target.innerHTML }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    setError("")
    const url = `${baseUrl}/api/article`
    const { _id } = article
    const { title, content } = updatedArticle
    const payload = { title, content, _id }
    await fetch(url,{
      method: "PUT",
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
      setShowArticle(data)
    }).catch(error=>{
      setError(error.message)
    })
    .finally(()=>{
      setLoading(false)
    })
  }
  return (
    <>
      <Message
        icon="pencil"
        header={t.article.update.header}
        color="orange"
      />
      <Segment>
        <Form
          loading={loading}
          error={Boolean(error)}
          onSubmit={handleSubmit}
        >
          <Message error 
            header={t.error}
            content={error} />
          <Form.Field
            control={Input}
            name="title"
            label={t.article.update.title}
            placeholder={t.article.update.title}
            onChange={handleChange}
            value={updatedArticle.title}
          />
          <Form.Field>
            <label>{t.article.update.content}</label>
            <RichTextEditor
              radius="md"
              value={updatedArticle.content}
              onBlur={handleChangeEditor}
              controls={editorOptions}
            />
          </Form.Field>
          <Form.Field
            control={Button}
            color="orange"
            icon="pencil"
            content={t.article.update.submit}
            type="submit"
            disabled={disabled || loading}
            />
        </Form>
      </Segment>
    </>
  )
}
 
export default ArticleUpdate