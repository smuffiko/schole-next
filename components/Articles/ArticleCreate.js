import React from "react"
import { InputFile } from 'semantic-ui-react-input-file'
import { Button, Form, Input, Message, Segment, Modal } from "semantic-ui-react"
import baseUrl from "../../utils/baseUrl"
import RichTextEditor from '../_App/RichTextEditor'
import { convertBytes } from "../../utils/convertBytes"

const INITIAL_ARTICLE = {
  title: "",
  description: "",
  content: "<p><br></p>",
  lang: "",
  videoUrl: "",
  video: null,
  key: Math.random()
}

const ArticleCreate = ({ setNewArticles, t }) => {
  const [article, setArticle] = React.useState(INITIAL_ARTICLE)
  const [video, setVideo] = React.useState(null)
  const [disabled, setDisabled] = React.useState(true)
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [videoLoading, setVideoLoading] = React.useState(false)
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
      const isArticle = Boolean(article.title)
        && Boolean(article.description)
        && Boolean(article.content)
        && article.content !== "<p><br></p>"
        && Boolean(article.lang)
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

  const handleRemoveVideo = event => {
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
    formData.append("upload_preset", process.env.UPLOAD_PRESET)
    formData.append("cloud_name", process.env.CLOUD_NAME)
    formData.append("api_key",process.env.API_KEY)
    formData.append("api_secret", process.env.API_SECRET)
    await fetch(process.env.URL,{
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
    if(result===null) console.log("Error uploading video, try use youtube link") //todo local, need test
    return result
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError("")

    const url = `${baseUrl}/api/article`
    const { title, content, lang, videoUrl, description } = article
    const payload = { title, content, lang, description }
    if(videoUrl!==null) payload.videoUrl = videoUrl
    else if(article.video) {
      setVideoLoading(true)
      const videoData = await handleUpload(event)
      setVideoLoading(false)
      payload.videoUrl = videoData.url
    }
    
    if(payload.videoUrl!==null) { // if it is youtue link, then chceck or update url
      if(payload.videoUrl.includes("youtube.com")) {
        const list = payload.videoUrl.indexOf("&list")
        if(list!==-1) payload.videoUrl=payload.videoUrl.substring(0,list)
      }
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
      setNewArticles(prevState=> [data, ...prevState])
      INITIAL_ARTICLE.key = Math.random()
      setArticle(INITIAL_ARTICLE)
      setVideo(null)
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
            options={langOptions}
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
          <Form.Group>
            <Form.Field className="three wide" >
            {video ? (
              <>
                <Message
                  size="tiny"
                  content={`Vybráno video:  ${video.name} , velikost: ${convertBytes(video.size)}`}
                />
                {/* todo media preview - local */}
                <Button
                  icon="trash"
                  label={{ basic: true, color: 'red', pointing: 'left', content: t.article.create.deleteVideo }}
                  color="red"
                  type="button"
                  onClick={handleRemoveVideo}
                />
              </>) : (
                <>
                  <InputFile
                    button={{
                      color:"orange",
                      label: { basic: true, color: 'red', pointing: 'left', content: t.article.create.selectVideo },
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
            <Form.Field
              control={Input}
              name="videoUrl"
              placeholder={t.article.create.videoUrl}
              onChange={handleChange}
              value={article.videoUrl}
              className="thirteen wide"
            />
          </Form.Group>          
          <Form.Field
            control={Input}
            name="description"
            label={t.article.create.description}
            placeholder={t.article.create.description}
            onChange={handleChange}
            value={article.description}
          />
          <Form.Field>
            <label>{t.article.create.content}</label>
            <RichTextEditor
              radius="md"
              value={article.content}
              key={article.key}
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
        <Modal.Header>{t.article.create.waitPlease}</Modal.Header>
        <Modal.Content>
          <div className="custom-spinner"></div>
          <p>{t.article.create.videoIsUploading}</p>
        </Modal.Content>
      </Modal>
    </>
  )
}
 
export default ArticleCreate