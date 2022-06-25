import React from "react"
import { Button, Form, Message, Segment, Input } from "semantic-ui-react"
import baseUrl from "../../utils/baseUrl"
import RichTextEditor from "../_App/RichTextEditor"

const INITIAL_PACK = {
  title: "",
  description: "",
  content: "<p><br></p>",
  lang: "",
  key: Math.random()
}

const PackCreate = ({ setNewPacks, t }) => {
  const [pack, setPack] = React.useState(INITIAL_PACK)
  const [disabled, setDisabled] = React.useState(true)
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("") 

  const langOptions = [
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
      const isPack = Boolean(pack.title) && Boolean(pack.content) && pack.content !== "<p><br></p>" && Boolean(pack.lang) && Boolean(pack.description)
      isPack ? setDisabled(false) : setDisabled(true)
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  },[pack])

  const handleChange = ( event, {value} ) => {
    const { name } = event.target
    if(name !== undefined) {
        setPack(prevState => ({ ...prevState, [name]: value })) // target -> base input
    } else setPack(prevState => ({ ...prevState, lang: value })) // if target is select -> set lang  
  }

  const handleChangeEditor = val => {
    if(val) setPack(prevState => ({ ...prevState, content: val }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError("")

    const url = `${baseUrl}/api/pack`
    const { title, content, description, lang } = pack
    const payload = { title, content, description, lang }

    setLoading(true)
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
    }).then(data => {
      setNewPacks(prevState=> [data, ...prevState])
      INITIAL_PACK.key = Math.random()
      setPack(INITIAL_PACK)
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
      <Message
        icon="pencil"
        header={t.pack.create.header}
        color="orange"
      />
      <Form
        loading={loading}
        error={Boolean(error)}
        success={success}
        onSubmit={handleSubmit}
      >
        <Message error 
          header={t.error}
          content={error} />
        <Message
          success
          icon="check"
          header={t.pack.create.success}
        />
        <Segment>
          <Form.Dropdown
            selection
            name="lang"
            label={t.pack.create.selectLanguage}
            placeholder={t.pack.create.language}
            value={pack.lang}
            options={langOptions}
            onChange={handleChange}
          />
          <Form.Field
            control={Input}
            name="title"
            label={t.pack.create.title}
            placeholder={t.pack.create.title}
            onChange={handleChange}
            value={pack.title}
          />
          <Form.Field
            control={Input}
            name="description"
            label={t.pack.create.description}
            placeholder={t.pack.create.description}
            onChange={handleChange}
            value={pack.description}
          />
          <Form.Field>
            <label>{t.pack.create.content}</label>
            <RichTextEditor
              radius="md"
              value={pack.content}
              key={pack.key}
              onChange={(val) => handleChangeEditor(val)}
              controls={editorOptions}
            />
          </Form.Field>
          <Form.Field
            control={Button}
            color="orange"
            icon="pencil"
            content={t.pack.create.submit}
            type="submit"
            disabled={disabled || loading}
          />
        </Segment>
      </Form>
    </>
  )
}
 
export default PackCreate