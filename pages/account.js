import { Container } from "semantic-ui-react"
import AccountDetails from "../components/Account/AccnoutDetails"
import AccountOrders from "../components/Account/AccountOrders"
import ManageAdmins from "../components/Account/ManageAdmins"
import { parseCookies } from "nookies"

const Account = ({ user, orders, t }) => {
  return (
  <>
    <Container>
      <AccountDetails user={user} t={t} />
      {user.role==="user" && (
        <AccountOrders orders={orders} t={t} />
      )}
      {user.role==="root" && (
        <ManageAdmins />
      )}
    </Container>
  </>
  )
}

export default Account