import React from "react"
import Router from "next/router"
import { Button, Container, Modal, Message } from "semantic-ui-react"
import ArticleDetails from "../components/Articles/ArticleDetails"
import baseUrl from "../utils/baseUrl"
import Back from "../components/_App/Back"
import ArticleUpdate from "../components/Articles/ArticleUpdate"

const Article = ({ boughtArticles, article, user, t }) => {
  const [modal, setModal] = React.useState(false)
  const [update, setUpdate] = React.useState(false)
  const [showArticle, setShowArticle] = React.useState(article)
  const [error, setError] = React.useState("")
  const isBought = boughtArticles.some(doc => article._id === doc._id)
  const isAuthorized = user.role==="admin" || user.role==="root" || isBought

  React.useEffect(()=>{
    if(!isAuthorized) Router.push("/404")  // unauthorized -> redirect
  },[])

  React.useEffect(()=>{
    setUpdate(false)
  },[showArticle])

  const handleDelete = async () => {
    setError("")
    const url = `${baseUrl}/api/article?_id=${article._id}`
    await fetch(url,{
      method: "DELETE"
    }).then(async response => {
      if(!response.ok) {
        const er = await response.text()
        throw new Error(er)
      }
      Router.back()
    }).catch(error=>{
      setError(error.message)
    })
  }

  return (
    <>
    <Container>
      <Message error
        header={t.error}
        content={error}
        hidden={!Boolean(error)}
      />
      {!update ? (
        <>
          <Back t={t}/>
          {(user.role === "admin" || user.role === "root") && (
          <>
            <Button
              icon='pencil'
              style={{width:"50%",margin:"auto 0",borderRadius:"10px 0 0 10px"}}
              color="orange"
              content={t.update}
              onClick={()=>setUpdate(true)}
            />
            <Button
              icon='trash'
              floated="right"
              style={{width:"50%",margin:"auto 0",borderRadius:"0 10px 10px 0"}}
              color="red"
              content={t.delete}
              onClick={()=>setModal(true)}
            />
            <Modal open={modal} dimmer="blurring">
              <Modal.Header>{t.article.delete.confirm}</Modal.Header>
              <Modal.Content>
                <p>{t.article.delete.content}</p>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => setModal(false)} content={t.cancel} />
                <Button
                  negative
                  icon="trash"
                  labelPosition="right"
                  content={t.delete}
                  onClick={handleDelete}
                />
              </Modal.Actions>
            </Modal>
          </>
        )}
          { isAuthorized && (<ArticleDetails article={showArticle} />)}
        </>
      ) : (user.role === "admin" || user.role === "root") && (
        <ArticleUpdate article={showArticle} t={t} setShowArticle={setShowArticle} setUpdate={setUpdate} />
      )}
    </Container>
    </>
  )
}
 
export default Article

export const getServerSideProps = async ({query: {_id }}) => {
  const url = `${baseUrl}/api/article?_id=${_id}`
  const article = await fetch(url,{
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  }).then(async response => {
    if(!response.ok) {
      const er = await response.text()
      throw new Error(er)
    }
    return response.json()
  })
  if(article)
    return { props: { article } }
  return { // /article without id or id which not exists -> 404 page
    redirect: {
      destination: '/404',
    }
  }
}