import { Container } from "semantic-ui-react"
import ArticleDetails from "../components/Article/ArticleDetails"
import baseUrl from "../utils/baseUrl"

const Article = ({ article }) => {
  return (
    <>
    <Container>
      <ArticleDetails article={article} />
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
  }).catch(error=>{
    // todo set error ?
  })  
  if(article)
    return { props: { article } }
  return { // /article without id or id which not exists -> 404 page
    redirect: {
      destination: '/404',
    }
  }
}