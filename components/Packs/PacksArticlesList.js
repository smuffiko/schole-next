import React from "react"
import { Card, Icon, Item, List, Segment } from "semantic-ui-react"
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
      return [{ header: "No article yet"}] // todo local
    const items = articles.map(article =>({
      key: article._id,
      header: <Card.Header> {article.video ? <Icon name="play" /> : ""} {article.title} </Card.Header>,
      meta: dateTime(article.createdAt),
      description: article.description
    }))
    return items
  }

  return (
    <>
      <Segment>
        <Item.Group
          divided
          items={mapArticlesToItems()}
        />
      </Segment>
    </>
  )
}
 
export default PacksArticlesList