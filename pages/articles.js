import { Container } from "semantic-ui-react"
import ArticlesList from "../components/Articles/ArticlesList"
import ArticlesPagination from "../components/Articles/ArticlesPagination"
import CreateArticle from "../components/Articles/CreateArticle"
import baseUrl from "../utils/baseUrl"

const Articles = ({ articles, t }) => {
  return (
    <>
      <Container>
        <CreateArticle t={t} />
        <ArticlesList  articles={articles} t={t} />
        <ArticlesPagination t={t} />
      </Container>
    </>
  )
}

export default Articles

export const getStaticProps = async ctx => {
  const url = `${baseUrl}/api/articles`
let articles = []
  await fetch(url,{
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
    articles = data
  }).catch(error => {
    console.log("Error in articles.js") // todo maybe setError or something, idk
  })

  return { props: articles }
}