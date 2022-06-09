import { Segment, Header, Label } from "semantic-ui-react"
import { dateTime } from "../../utils/formatDate"

const ArticleDetails = ({ article }) => {
  const { title, createdAt, content, language } = article
  return (
    <>
      <Segment>
        <Header as="h2">
          {title}
        </Header>     
        <Label>{language.toUpperCase()} {dateTime(createdAt)}</Label>
        <div style={{whiteSpace:"pre-line", marginTop:"1em"}} dangerouslySetInnerHTML={{__html: content}}></div>   
      </Segment>
    </>
  )
}
 
export default ArticleDetails