import React from "react"
import { Card, Message, Container, Transition, Button, Icon, Label } from "semantic-ui-react"
import { dateTime } from "../../utils/formatDate"
import Router from "next/router"

const ArticlesList = ({ articles, showArticles, setShowArticles, t }) => {
    const mapArticlesToItems = articles => {
    return articles.map(article => 
      <Card
        fluid={true}
        key={article._id}
        style={{wordBreak:"break-word"}}
      >
        <Card.Header
          as="h3"
          onClick={()=>{ Router.push(`/article?_id=${article._id}`) }}
          style={{paddingTop:"1.6em",textAlign:"center"}}
        >
          {article.video && (
            <>
              <Label ribbon color="orange" style={{
                position: "absolute",
                top: "-1px",
                left: "-15px"
              }}>
                <Icon name="youtube play" size="large"/>
              </Label>
            </>
          )}
          <a>{article.title}</a>
        </Card.Header>
        <Card.Meta style={{textAlign:"center"}} >
          {`${article.language.toUpperCase()} ${dateTime(article.createdAt)}`}
        </Card.Meta>
        <Card.Description style={{padding:"1em", textAlign:"justify"}} >
          {article.content.replace(/<\/?[^>]+(>|$)/g, " ").replace("  "," ").substring(0,300)}...
        </Card.Description>
      </Card>
    )
  }

  const handleNext = ()=> {
    setShowArticles((prevState) => 
      (articles.slice(0, prevState.length + 8))
    )
  }
  const handleAll = ()=> 
    setShowArticles(articles)

  return (
  <>
    <Container style={{marginTop:"2em"}}>
      <Message
        icon="file alternate outline"
        header={t.article.list.articlesList}
        color="orange"
      />
      <Transition.Group
        as={Card.Group}
          stackable
          itemsPerRow="4"
          doubling
          centered
          style={{marginTop:"1em"}}
        >
        {mapArticlesToItems(showArticles)}
      </Transition.Group> 
      {!(articles.length === showArticles.length) && (
        <Container textAlign="center" >
          <Button
            className="button-load-next"
            icon='plus'
            onClick={handleNext}
            content={t.article.list.loadNext}
            fluid
            color="orange"
          />
          <Button
            className="button-load-next"
            icon='plus'
            onClick={handleAll}
            content={t.article.list.loadAll}
            fluid
            color="orange"
          />
        </Container>
      )}
    </Container>
  </>
  )
}
 
export default ArticlesList