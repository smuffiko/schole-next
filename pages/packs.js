import React from "react"
import { Container } from "semantic-ui-react"
import PackCreate from "../components/Packs/PackCreate"
import PacksList from "../components/Packs/PacksList"
import baseUrl from "../utils/baseUrl"

const Packs = ({ packs, user, t }) => {
  const [newPacks, setNewPacks] = React.useState(packs)
  const [showPacks, setShowPacks] = React.useState(packs.slice(0,8))

  React.useEffect(()=>{
    setShowPacks(prevState => newPacks.slice(0,prevState.length))
  },[newPacks])

  return (
    <>
      <Container style={{color:"white"}}> {/* todo remove style */}
        {(user.role==="admin" || user.role==="root") && (
          <>
            <PackCreate
              t={t}
              setNewPacks={setNewPacks}
            />
          </>
        )}
        {packs.length!==0 && (
          <>
            <PacksList
              t={t}
              showPacks={showPacks}
              setShowPacks={setShowPacks}
            />
          </>
        )}
      </Container>
    </>
  )
}
 
export default Packs

export const getServerSideProps = async ctx => {
  const url = `${baseUrl}/api/packs`
  const packs = await fetch(url,{
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(async response => {
    if(!response.ok) {
      throw new Error(await response.text())
    }
    return response.json()
  }).then(data => {
    return data.packs
  }).catch(error => {
    console.log("Error in packs.js") // todo
  })
  return { props: { packs } }
}