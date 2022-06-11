import { Segment, Header, Label } from "semantic-ui-react"
import { dateTime } from "../../utils/formatDate"
import VideoPlayer from "./VideoPlayer"

const ArticleDetails = ({ article }) => {
  const { title, createdAt, content, language, video } = article
  return (
    <>
      <Segment>
        <Header as="h2">
          {title}
        </Header>     
        <Label>{language.toUpperCase()} {dateTime(createdAt)}</Label>
        {video && (<VideoPlayer url={"https://www.youtube.com/watch?v=hEhutIEUq8k&list=RDhEhutIEUq8k&start_radio=1"}/>)}
        <div style={{whiteSpace:"pre-line", marginTop:"1em"}} dangerouslySetInnerHTML={{__html: content}}></div>   
      </Segment>
    </>
  )
}
 
export default ArticleDetails