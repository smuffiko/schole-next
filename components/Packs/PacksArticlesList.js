import React from "react"
import { Button, Card, Checkbox, Icon, Item, List, Segment } from "semantic-ui-react"
import baseUrl from "../../utils/baseUrl"
import { dateTime } from "../../utils/formatDate"

const PacksArticlesList = ({ pack, update, t }) => {
  const [articles, setArticles] = React.useState([])

  React.useEffect(async ()=>{
    if(update) { // update page -> all articles
      const url = `${baseUrl}/api/articles`
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

  const mapArticlesToItems = () => { 
    if(articles.length==0) 
      return <Item.Content>No article yet</Item.Content> // todo local
    const items = articles.map(article =>(
      <Item key={article._id} style={{position:"relative"}}>
        <div style={{position:"relative"}}>
          <Checkbox
            slider
          />
        </div>
      <Item.Content style={{marginLeft:"1em"}}>
        <Item.Header>{article.title}</Item.Header>
        <Item.Meta>{article.language.toUpperCase()} {dateTime(article.createdAt)}</Item.Meta>
        <Item.Description>{article.description}</Item.Description>
      </Item.Content>
      </Item>
    ))
    return items
  }

  return (
    <>
      <Segment>
        <Item.Group divided unstackable>
          {mapArticlesToItems()}
        </Item.Group>
      </Segment>
    </>
  )
}
 
export default PacksArticlesList