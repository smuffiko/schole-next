import React from "react"
import { Container } from "semantic-ui-react"
import ArticlesList from "../components/Articles/ArticlesList"
import ArticleCreate from "../components/Articles/ArticleCreate"
import baseUrl from "../utils/baseUrl"

const Articles = ({ articles, t }) => {  
  const [newArticles, setNewArticles] = React.useState(articles)
  
  const [showArticles, setShowArticles] = React.useState(articles.slice(0,8))

  React.useEffect(()=>{
    setShowArticles(prevState => newArticles.slice(0,prevState.length))
  },[newArticles])

  return (
    <>
      <Container>
        <ArticleCreate
          t={t}
          setNewArticles={setNewArticles}
        />
        {articles.length!==0 && (
          <>
            <ArticlesList
              t={t}
              articles={newArticles}
              showArticles={showArticles}
              setShowArticles={setShowArticles}
            />
          </>
        )}
      </Container>
    </>
  )
}

export default Articles

export const getServerSideProps = async ctx => {
  const url = `${baseUrl}/api/articles`
  const articles = await fetch(url,{
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(async response => {
    if(!response.ok) {
      throw new Error(await response.text())
    }
    return response.json()
  }).then(data => {
    return data.articles
  }).catch(error => {
    console.log("Error in articles.js") // todo maybe setError or something, idk
  })
  return { props: { articles } }
}