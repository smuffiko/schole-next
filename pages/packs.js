import React from "react"
import { Container, Message, Segment } from "semantic-ui-react"
import PackCreate from "../components/Packs/PackCreate"
import PacksList from "../components/Packs/PacksList"
import baseUrl from "../utils/baseUrl"

const Packs = ({ packs, boughtPacks, user, t }) => {
  const [newPacks, setNewPacks] = React.useState(packs.filter(p=> !boughtPacks.some(b=> b._id === p._id)))
  const [showPacks, setShowPacks] = React.useState(newPacks.slice(0,8))
  const [loading, setLoading] = React.useState(true)

  React.useEffect(()=> setLoading(false),[])

  React.useEffect(()=>{
    setShowPacks(prevState => {
      let length = prevState.length
      if(prevState.length<8) length++
      return newPacks.slice(0,length)
    })
  },[newPacks])

  return (
    <>
      <Container> 
        {(user.role==="admin" || user.role==="root") && (
          <>
            <PackCreate
              t={t}
              setNewPacks={setNewPacks}
            />
          </>
        )}
        {newPacks.length === 0 ? (
          <Message
            warning
            icon="settings"
            content={t.pack.noPack}
          />
        ) :
          <>
           {!loading && (
            <>
              <PacksList
                t={t}
                packs={newPacks}
                showPacks={showPacks}
                setShowPacks={setShowPacks}
              />
            </>
            )}
          </>
        }
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
  })
  return { props: { packs } }
}