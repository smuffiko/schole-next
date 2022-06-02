import { Icon } from "semantic-ui-react"

const NotFound = ({ t }) => {
  return (<>
    <h1><Icon name="x" size="large"/> {t.err404}</h1>
  </>)
}
 
export default NotFound