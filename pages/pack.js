import React from "react"
import Router from "next/router"
import { Button, Container, Modal } from "semantic-ui-react"
import PackDetails from "../components/Packs/PackDetails"
import baseUrl from "../utils/baseUrl"
import Back from "../components/_App/Back"
import PackUpdate from "../components/Packs/PackUpdate"

const Pack = ({ pack, user, t }) => {
  const [modal, setModal] = React.useState(false)
  const [update, setUpdate] = React.useState(false)
  const [showPack, setShowPack] = React.useState(pack)

  React.useEffect(()=>{
    setUpdate(false)
  },[showPack])

  const handleDelete = async () => {
    const url = `${baseUrl}/api/pack?_id=${pack._id}`
    await fetch(url,{
      method: "DELETE"
    }).then(async response => {
      if(!response.ok) {
        const er = await response.text()
        throw new Error(er)
      }
      Router.back()
    }).catch(error=>{
      console.error(error) // todo set error or smt
    })
  }

  return (
    <>
    <Container>
      {!update ? (
        <>
          <Back t={t}/>
          {(user.role === "admin" || user.role === "root") && (
          <>
            <Button
              icon='pencil'
              style={{width:"50%",margin:"auto 0",borderRadius:"10px 0 0 10px"}}
              color="orange"
              content={t.update}
              onClick={()=>setUpdate(true)}
            />
            <Button
              icon='trash'
              floated="right"
              style={{width:"50%",margin:"auto 0",borderRadius:"0 10px 10px 0"}}
              color="red"
              content={t.delete}
              onClick={()=>setModal(true)}
            />
            <Modal open={modal} dimmer="blurring">
              <Modal.Header>{t.pack.delete.confirm}</Modal.Header>
              <Modal.Content>
                <p>{t.pack.delete.content}</p>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => setModal(false)} content={t.cancel} />
                <Button
                  negative
                  icon="trash"
                  labelPosition="right"
                  content={t.delete}
                  onClick={handleDelete}
                />
              </Modal.Actions>
            </Modal>
          </>
        )}
        <PackDetails pack={showPack} />
        </>
      ) : (user.role === "admin" || user.role === "root") && (
          <PackUpdate pack={showPack} t={t} setShowPack={setShowPack} setUpdate={setUpdate} />
      )}
    </Container>
    </>
  )
}
 
export default Pack

export const getServerSideProps = async ({query: {_id }}) => {
  const url = `${baseUrl}/api/pack?_id=${_id}`
  const pack = await fetch(url,{
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  }).then(async response => {
    if(!response.ok) {
      const er = await response.text()
      throw new Error(er)
    }
    return response.json()
  }).catch(error=>{
    console.log(error)
    // todo set error ?
  })  
  if(pack)
    return { props: { pack } }
  return { // /pack without id or id which not exists -> 404 page
    redirect: {
      destination: '/404',
    }
  }
}