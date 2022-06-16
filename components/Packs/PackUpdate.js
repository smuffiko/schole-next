import React from "react"
import { Form, Button, Segment, Input, Message } from "semantic-ui-react"
import RichTextEditor from "../_App/RichTextEditor"
import baseUrl from "../../utils/baseUrl"



const PackUpdate = ({ pack, setShowPack, t }) => {
  const [ updatedPack, setUpdatedPack ] = React.useState({
    title: pack.title,
    content: pack.content
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
    const isPack = Object.values(updatedPack).every(el => Boolean(el))
    isPack ? setDisabled(false) : setDisabled(true)
  },[updatedPack])
  
  const handleChange = (event, { value }) => {
    const name = event.target.name
    setUpdatedPack(prevState => ({ ...prevState, [name]: value }))
  }
  const handleChangeEditor = val => {
    setUpdatedPack(prevState => ({ ...prevState, content: val.target.innerHTML }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    setError("")
    const url = `${baseUrl}/api/pack`
    const { _id } = pack
    const { title, content } = updatedPack
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
      setShowPack(data)
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
        header={t.pack.update.header}
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
            content={error}
          />
          <Form.Field
            control={Input}
            name="title"
            label={t.pack.update.title}
            placeholder={t.pack.update.title}
            onChange={handleChange}
            value={updatedPack.title}
          />
          <Form.Field>
            <label>{t.pack.update.content}</label>
            <RichTextEditor
              radius="md"
              value={updatedPack.content}
              onBlur={handleChangeEditor}
              controls={editorOptions}
            />
          </Form.Field>
          <Form.Field
            control={Button}
            color="orange"
            icon="pencil"
            content={t.pack.update.submit}
            type="submit"
            disabled={disabled || loading}
          />
        </Form>
      </Segment>
    </>
  )
}
 
export default PackUpdate