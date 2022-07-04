import React from "react"
import Router from "next/router"
import { Checkbox, Icon, Item, Loader, Message, Segment } from "semantic-ui-react"
import baseUrl from "../../utils/baseUrl"
import { dateTime } from "../../utils/formatDate"

const PacksArticlesList = ({ pack, update, allArticles, setShowPack, isBought, t }) => {
  const [articles, setArticles] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(()=>{
    setLoading(true)
    if(update) { // update page -> all articles
      setArticles(allArticles)
    } else { // normal page -> pack.articles
      setArticles(pack.articles)
    }
    setLoading(false)
  },[update])

  return (
    <>
    <Message error
      header={t.error}
      content={error}
      hidden={!Boolean(error)}
    />
    {articles.length!==0 && (
      <>
        <Message
          icon="file alternate outline"
          header={t.pack.list.articlesList}
          color="orange"
        />
        <Segment>
          <Loader active={loading} size="massive" />
            <Item.Group divided unstackable>
              {articles.map(a => {
                const article = a.article ? a.article : a
                return (
                  <ArticleToItem
                    key={article._id}
                    article={article}
                    pack={pack}
                    setShowPack={setShowPack}
                    update={update}
                    loading={loading}
                    setLoading={setLoading}
                    setError={setError}
                    isBought={isBought}
                  />
                )
              })}
            </Item.Group>
        </Segment>
      </>
    )}
    </>
  )
}

const ArticleToItem = ({ article, pack, setShowPack, update, loading, setLoading, setError, isBought }) => {
  const [isInPack, setIsInPack] = React.useState(Boolean(pack.articles.find(a => a.article._id == article._id)))
  const isFirstRun = React.useRef(true)

  React.useEffect(()=>{
    if (isFirstRun.current) {
      isFirstRun.current = false
      return;
    }
    updatePack()
  },[isInPack])

  const handleUpdatePack = () => {
    setIsInPack(prevState => !prevState)
  }

  const updatePack = async () => {
    // fetch and update pack - set or delete
    setLoading(true)
    setError("")
    const url = `${baseUrl}/api/pack`
    const payload = { _id: pack._id, article: article._id, isInPack }
    await fetch(url,{
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(async response=> {
      if(!response.ok) {
        const er = await response.text()
        throw new Error(er)
      }
      return response.json()
    }).then(data => {
      setShowPack(data)
    }).catch(error=>{
      setError(error.message)
    }).finally(()=>{
      setLoading(false)
    })
  }

  return (
    <Item
      style={{position:"relative"}}
    >
      { update && (
        <div style={{position:"relative"}}>
          <Checkbox
            checked={isInPack}
            onClick={handleUpdatePack}
            slider
            disabled={loading}
          />
        </div>
      )}
      <Item.Content style={{marginLeft:"1em"}}>
        <Item.Header>
          {article.video && <Icon name="play" />}
          {isBought ? (
          <>
            <a onClick={()=>Router.push(`/article?_id=${article._id}`)}>{article.title}</a>
          </>
          ) : (
          <>{article.title}</>
          )}
        </Item.Header>
        <Item.Meta>{article.language.toUpperCase()} {dateTime(article.createdAt)}</Item.Meta>
        <Item.Description>{article.description}</Item.Description>
      </Item.Content>
    </Item>
  )
}
 
export default PacksArticlesList