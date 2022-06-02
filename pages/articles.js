import { Container } from "semantic-ui-react"
import ArticlesList from "../components/Articles/ArticlesList"
import ArticlesPagination from "../components/Articles/ArticlesPagination"
import CreateArticle from "../components/Articles/CreateArticle"


const Articles = ({ t }) => {
  return (
    <>
      <Container>
        <CreateArticle t={t} />
        <ArticlesList  t={t} />
        <ArticlesPagination t={t} />
      </Container>
    </>
  )
}
 
export default Articles