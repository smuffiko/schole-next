import React from "react"
import { Button, Card, Checkbox, Icon, Item, List, Segment } from "semantic-ui-react"
import baseUrl from "../../utils/baseUrl"
import { dateTime } from "../../utils/formatDate"

const PacksArticlesList = ({ pack, update, t }) => {
  const [articles, setArticles] = React.useState([])

  React.useEffect(async ()=>{
    if(update) { // update page -> all articles
      const language = pack.language
      const url = `${baseUrl}/api/articles?language=${language}`
      const data = await fetch(url,{
        method: "GET"
      }).then(async response=> {
        if(!response.ok) {
          const er = await response.text()
          throw new Error(er)
        }
        return response.json()
      })
      setArticles(data)
    } else { // normal page -> pack.articles
      setArticles(pack.articles)
    }
  },[update])

  return (
    <>
    {articles.length!==0 && (
      <Segment>
          <Item.Group divided unstackable>
            {articles.map(article =>
              <ArticleToItem key={article._id} article={article} pack={pack} />
            )}
          </Item.Group>
      </Segment>
    )}
    </>
  )
}

const ArticleToItem = ({ article, pack }) => {

  const isInPack = pack.articles.find(a => a._id === article._id)
  
  return (
    <Item style={{position:"relative"}}>
      <div style={{position:"relative"}}>
        <Checkbox
          checked={isInPack}
          slider
        />
      </div>
    <Item.Content style={{marginLeft:"1em"}}>
      <Item.Header>{article.title}</Item.Header>
      <Item.Meta>{article.language.toUpperCase()} {dateTime(article.createdAt)}</Item.Meta>
      <Item.Description>{article.description}</Item.Description>
    </Item.Content>
    </Item>
  )
}
 
export default PacksArticlesList