import { Container, Header, Segment } from "semantic-ui-react"
import baseUrl from "../utils/baseUrl"
import { dateTime } from "../utils/formatDate"

const Article = ({ article }) => {
  const { title, createdAt, content, language } = article
  console.log(content)
  return (
    <>
    <Container>
      <Segment>
        <Header as="h2">
          {title}
        </Header>     
        <div>{language.toUpperCase()} {dateTime(createdAt)}</div>
        <div style={{whiteSpace:"pre-line"}}>{content}</div>   
      </Segment>
    </Container>
    </>
  )
}
 
export default Article


export const getServerSideProps = async ({ query: {_id }}) => {
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
  return { props: { article } }
}