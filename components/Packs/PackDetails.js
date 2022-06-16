import { Header, Label, Segment } from "semantic-ui-react"
import { dateTime } from "../../utils/formatDate"

const PackDetails = ({ pack }) => {
  const { title, content, language, createdAt } = pack
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
 
export default PackDetails