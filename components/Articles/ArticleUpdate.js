import React from "react"
import { Form, Button, Segment, Input, Message, Modal } from "semantic-ui-react"
import RichTextEditor from "../_App/RichTextEditor"
import baseUrl from "../../utils/baseUrl"

const ArticleUpdate = ({ article, setShowArticle, setUpdate, t }) => {
  const [updatedArticle, setUpdatedArticle] = React.useState({
    title: article.title,
    description: article.description,
    content: article.content
  })
  const [modal, setModal] = React.useState(false)
  const [disabled, setDisabled] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("") 

  React.useEffect(()=>{
    const isArticle = Object.values(updatedArticle).every(el => Boolean(el)) && updatedArticle.content !== "<p></p>"
    isArticle ? setDisabled(false) : setDisabled(true)
  },[updatedArticle])

  const handleChange = (event, { value }) => {
    const name = event.target.name 
    setUpdatedArticle(prevState => ({ ...prevState, [name]: value }))
  } 
  const handleChangeEditor = e => {
    const value = e.editor.getHTML()
    setUpdatedArticle(prevState => ({ ...prevState, content: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    setError("")
    const url = `${baseUrl}/api/article`
    const { _id } = article
    const { title, content, description } = updatedArticle
    const payload = { title, content, description, _id }
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
          <Form.Field
            control={Input}
            name="description"
            label={t.article.update.description}
            placeholder={t.article.update.description}
            onChange={handleChange}
            value={updatedArticle.description}
          />
          <Form.Field>
            <label>{t.article.update.content}</label>
            <RichTextEditor
              value={article.content}
              handleChangeEditor={handleChangeEditor}  
            />
          </Form.Field>
          <Form.Group>
            <Form.Field
              control={Button}
              color="orange"
              icon="pencil"
              content={t.article.update.submit}
              type="submit"
              disabled={disabled || loading}
            />
            <Form.Field
              control={Button}
              icon="x"
              content={t.discard}
              type="button"
              disabled={disabled || loading}
              onClick={() => setModal(true)}
            />
          </Form.Group>
          <Modal open={modal} dimmer="blurring">
          <Modal.Header>{t.discardHeader}</Modal.Header>
          <Modal.Content>
            <p>{t.discardContent}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setModal(false)} content={t.cancel} />
            <Button
              negative
              icon="trash"
              labelPosition="right"
              content={t.discard}
              onClick={() => setUpdate(false)}
            />
          </Modal.Actions>
        </Modal>
        </Form>
      </Segment>
    </>
  )
}
 
export default ArticleUpdate