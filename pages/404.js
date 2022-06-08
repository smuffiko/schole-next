import { Container, Icon } from "semantic-ui-react"
import Back from "../components/_App/Back"

const NotFound = ({ t }) => {
  return (<>
    <Container>
      <h1 style={{color:"white"}}><Icon name="x" size="large"/> {t.err404}</h1>
      <Back t={t} />
    </Container>
  </>)
}
 
export default NotFound