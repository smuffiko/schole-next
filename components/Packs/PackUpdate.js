import React from "react"
import { Form, Button, Segment, Input, Message, Modal } from "semantic-ui-react"
import RichTextEditor from "../_App/RichTextEditor"
import baseUrl from "../../utils/baseUrl"



const PackUpdate = ({ pack, setShowPack, setUpdate, t }) => {
  const [ updatedPack, setUpdatedPack ] = React.useState({
    title: pack.title,
    description: pack.description,
    content: pack.content
  })
  const [ modal, setModal ] = React.useState(false)
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
    const isPack = Boolean(pack.title) && Boolean(pack.content) && pack.content !== "<p><br></p>"  && Boolean(pack.description)
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
    const { title, content, description } = updatedPack
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
      setShowPack(data)
      setUpdate(false)
    }).catch(error=>{
      setError(error.message)
      setLoading(false)
    })
  }

  const handleDiscard = () => {
    setShowPack(pack)
    setUpdate(false)
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
          <Form.Field
            control={Input}
            name="description"
            label={t.pack.update.description}
            placeholder={t.pack.update.description}
            onChange={handleChange}
            value={updatedPack.description}
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
          <Form.Group>
            <Form.Field
              control={Button}
              color="orange"
              icon="pencil"
              content={t.pack.update.submit}
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
        </Form>
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
              onClick={handleDiscard}
            />
          </Modal.Actions>
        </Modal>
      </Segment>
    </>
  )
}
 
export default PackUpdate