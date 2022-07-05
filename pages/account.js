import { Container } from "semantic-ui-react"
import AccountDetails from "../components/Account/AccnoutDetails"
import AccountOrders from "../components/Account/AccountOrders"
import ManageAdmins from "../components/Account/ManageAdmins"

const Account = ({ user, t }) => {
  return (
  <>
    <Container>
      <AccountDetails user={user} t={t} />
      {user.role==="user" && (
        <AccountOrders />
      )}
      {user.role==="root" && (
        <ManageAdmins />
      )}
    </Container>
  </>
  )
}
 
export default Account