import React from "react"
import { Segment, Header, Table, Icon, Checkbox } from "semantic-ui-react"
import baseUrl from "../../utils/baseUrl"
import cookie from "js-cookie"
import { dateTime } from "../../utils/formatDate"

const ManageAdmins = ({ t }) => {
  const [users, setUsers] = React.useState([])

  React.useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async() => {
    const url = `${baseUrl}/api/users`
    const token = cookie.get("token")
    await fetch(url,{
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": token
      }
    }).then(async response=> {
      if(!response.ok) {
        const er = await response.text()
        throw new Error(er)
      }
      return response.json()
    }).then(users=>{
      setUsers(users)
    })
  }

  return (
    <>
      <Segment>
        <Header as="h2">
          <Icon name="settings" />
          User Permissions todo local cela table 
        </Header>
        <Table compact celled definition>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Joined</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {users.map(user => (
              <UserPermission key={user._id} user={user} />
            ))}
          </Table.Body>
        </Table>
      </Segment>
    </>
  )
}

const UserPermission = ({ user }) => {
  const [admin, setAdmin] = React.useState(user.role === "admin")
  const isFirstRun = React.useRef(true)

  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    if(user.role!=="root" && user.role!=="userN") updatePermission()
  }, [admin])

  const handleChangePermission = () => {
    setAdmin(prevState => !prevState)
  }

  const updatePermission = async () => {
    const url = `${baseUrl}/api/users`
    const payload = { _id: user._id, role: admin ? "admin" : "user" }
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(payload)
    })
  }

  console.log(user.role)

  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox checked={admin} toggle onChange={handleChangePermission} disabled={user.role==="root"||user.role==="userN"} />
      </Table.Cell>
      <Table.Cell>{user.name}</Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>{dateTime(user.createdAt)}</Table.Cell>
      <Table.Cell>{user.role === "root" ? "root" : user.role === "userN" ? "userN" : admin ? "admin" : "user"}</Table.Cell>
    </Table.Row>
  )
}
 
export default ManageAdmins