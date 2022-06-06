import { Container, Icon } from "semantic-ui-react"
import Router from "next/router"

const NotFound = ({ t }) => {
  return (<>
    <Container>
      <h1 style={{color:"white"}}><Icon name="x" size="large"/> {t.err404}</h1>
      <h3 onClick={()=>Router.back()} style={{color:"white",cursor:"pointer"}}><Icon name="arrow alternate circle left outline"/>{t.back}</h3>
    </Container>
  </>)
}
 
export default NotFound