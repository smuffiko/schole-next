import { Container } from "semantic-ui-react"
import AccountLang from "../components/Account/AccountLang"

const Account = ({ changeLang }) => {
  return (
  <>
    <Container>
      <AccountLang changeLang={changeLang}/>
    </Container>
  </>
  )
}
 
export default Account