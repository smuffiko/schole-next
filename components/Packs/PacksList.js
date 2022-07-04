import React from "react"
import Router from "next/router"
import { dateTime } from "../../utils/formatDate"
import { Card, Container, Message, Transition, Button } from "semantic-ui-react"

const PacksList = ({ packs, showPacks, setShowPacks, t }) => {
  const mapPacksToItems = packs => {
    return packs.map(pack => 
      <Card
        fluid={true}
        key={pack._id}
        style={{wordBreak:"break-word"}}
      >
        <Card.Header
          as="h3"
          onClick={()=>{ Router.push(`/pack?_id=${pack._id}`) }}
          style={{paddingTop:"1.6em",textAlign:"center"}}
        >
          <a>{pack.title}</a>
        </Card.Header>
        <Card.Meta style={{textAlign:"center"}} >
          {`${pack.language.toUpperCase()} ${dateTime(pack.createdAt)}, ${pack.price},- Kč`}
        </Card.Meta>
        <Card.Description style={{padding:"1em", textAlign:"justify"}} >
          {pack.description}
        </Card.Description>
      </Card>
    )
  }
  
  const handleNext = ()=> {
    setShowPacks((prevState) => 
      (packs.slice(0, prevState.length + 8))
    )
  }
  const handleAll = ()=> 
    setShowPacks(packs)

  return (
    <>
      <Container style={{marginTop:"2em"}}>
        <Message
          icon="file alternate outline"
          header={t.pack.list.packsList}
          color="orange"
        />        
        <Transition.Group
            as={Card.Group}
            stackable
            itemsPerRow="4"
            doubling
            centered
            style={{marginTop:"1em"}}
          >
          {mapPacksToItems(showPacks)}
        </Transition.Group> 
        {!(packs.length === showPacks.length) && (
          <Container textAlign="center" >
            <Button
              className="button-load-next"
              icon='plus'
              onClick={handleNext}
              content={t.pack.list.loadNext}
              fluid
              color="orange"
            />
            <Button
              className="button-load-next"
              icon='plus'
              onClick={handleAll}
              content={t.pack.list.loadAll}
              fluid
              color="orange"
            />
          </Container>
        )}        
      </Container>
    </>
  )
}
 
export default PacksList