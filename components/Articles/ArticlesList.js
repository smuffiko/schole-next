import { Card, Message, Container } from "semantic-ui-react"
import { dateTime } from "../../utils/formatDate"
import Router from "next/router"

const ArticlesList = ({ articles, t }) => {
  const mapArticlesToItems = articles => {
    return articles.map(article =>(
      <Card
        fluid={true}
        key={article._id}
        style={{wordBreak:"break-word"}}
      >
        <Card.Header
          as="h3"
          onClick={()=>{ Router.push(`/article?_id=${article._id}`)}}
          style={{paddingTop:"0.5em",textAlign:"center"}}
        >
          <a>{article.title}</a>
        </Card.Header>
        <Card.Meta
          style={{textAlign:"center"}}
        >
          {`${article.language.toUpperCase()} ${dateTime(article.createdAt)}`}
        </Card.Meta>
        <Card.Description
          style={{padding:"1em", textAlign:"justify"}}
        >
          {article.content.substring(0,300)}
        </Card.Description>
      </Card>
    ))
  }

  return (
  <>
    <Container style={{marginTop:"2em"}}>
      <Message
        icon="file alternate outline"
        header={t.article.list.articlesList}
        color="orange"
      />
      <Card.Group
        stackable
        itemsPerRow="4"
        doubling
        centered
        style={{marginTop:"1em"}}
      >
        {mapArticlesToItems(articles)}
      </Card.Group>
    </Container>
  </>
  )
}
 
export default ArticlesList