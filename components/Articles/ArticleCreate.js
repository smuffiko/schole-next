import React from "react"
import { InputFile } from 'semantic-ui-react-input-file'
import { Button, Container, Form, Input, Message, Segment, Modal, Icon } from "semantic-ui-react"
import baseUrl from "../../utils/baseUrl"
import RichTextEditor from '../_App/RichTextEditor'
import { convertBytes } from "../../utils/convertBytes"

const INITIAL_ARTICLE = {
  title: "",
  content: "",
  lang: ""
}

const ArticleCreate = ({ setNewArticles, t }) => {
  const [article, setArticle] = React.useState(INITIAL_ARTICLE)
  const [video, setVideo] = React.useState(null)
  const [disabled, setDisabled] = React.useState(true)
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [videoLoading, setVideoLoading] = React.useState(false)
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
    console.log(article)
    const delayDebounceFn = setTimeout(() => {
      const isArticle = Object.values(article).every(el => Boolean(el)) && article.content !== "<p><br></p>"
      isArticle ? setDisabled(false) : setDisabled(true)
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  },[article])

  const handleChange = (event, {value}) => {
    const { name } = event.target
    if(name !== undefined) {
      setArticle(prevState => ({ ...prevState, [name]: value })) // target -> base input
    } else setArticle(prevState => ({ ...prevState, lang: value })) // if target is select -> set lang
  } 

  const handleChangeEditor = val => {
    if(val) setArticle(prevState => ({ ...prevState, content: val }))
  }

  const handleChangeVideo = event => {
    const { files } = event.target
    setArticle(prevState => ({ ...prevState, video: files[0] })) // target -> video -> set video
    setVideo(files[0])
  }

  const handleRemoveVideo = async event => {
    setArticle((prevState)=>{
      const { video, ...rest } = prevState
      return rest
    })
    setVideo(null)
  }

  const handleUpload = async(event) => {
    event.preventDefault()
    let result = null
    const formData = new FormData()
    formData.append("file", article.video)
    formData.append("upload_preset", process.env.cloudinary.UPLOAD_PRESET)
    formData.append("cloud_name", process.env.cloudinary.CLOUD_NAME)
    formData.append("api_key",process.env.cloudinary.API_KEY)
    formData.append("api_secret", process.env.cloudinary.API_SECRET)
    
    await fetch(process.env.cloudinary.URL,{
      method: "POST",
      body: formData
    }).then(async response=> {
      if(!response.ok) {
        const er = await response.text()
        throw new Error(er)
      }
      return response.json()
    }).then(data => {
      result = data
    }).catch(error=>{
      setError(error.message)
    })
    if(result===null) throw new Error("Error video") //todo local
    return result
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError("")
    const url = `${baseUrl}/api/article`
    const { title, content, lang } = article
    let payload = { title, content, lang }
    if(article.video) {
      setVideoLoading(true)
      const videoData = await handleUpload(event)
      setVideoLoading(false)
      payload.videoURL = videoData.url
    }
    setLoading(true)
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
            <Form.Field
            >
            {video ? 
            (<>
              <Message
                size="tiny"
                content={`Vybráno video:  ${video.name} , velikost: ${convertBytes(video.size)}`}
              />
               {/* todo media preview */}
              <Button
                icon="trash"
                label={{ basic: true, color: 'red', pointing: 'left', content: 'Odstranit video' }}
                color="red"
                type="button"
                onClick={handleRemoveVideo}
              />
            </>) : (
              <>
                <InputFile
                  button={{
                    color:"orange",
                    label: { basic: true, color: 'red', pointing: 'left', content: 'Vybrat video' },
                    type: "button"
                  }}
                  input={{
                    id: 'input-control-id',
                    accept: "video/*",
                    name: "video",
                    onChange: handleChangeVideo
                  }}
                />              
              </>
            )}
            </Form.Field>
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
        <Modal open={videoLoading} dimmer="blurring" style={{textAlign:"center"}}>
            <Modal.Header>Wait please</Modal.Header> {/**todo local */}
            <Modal.Content>
              <div className="spinner"></div>
              <p>Video is uploading...</p>
            </Modal.Content>
          </Modal>
      </Container>
    </>
  )
}
 
export default ArticleCreate