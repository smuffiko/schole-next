import { Container, Icon } from "semantic-ui-react"

const NotFound = ({ t }) => {
  return (<>
    <Container>
      <h1 style={{color:"white"}}><Icon name="x" size="large"/> {t.err404}</h1>
    </Container>
  </>)
}
 
export default NotFound