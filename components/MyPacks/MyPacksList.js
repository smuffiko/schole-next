import Router from "next/router"
import { Message, Transition, Card } from "semantic-ui-react"
import { dateTime } from "../../utils/formatDate"

const MyPacksList = ({ boughtPacks, t }) => {
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

  return (
    <>
      <Message
        icon="file alternate outline"
        header={t.myPacks.listHeader}
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
        {mapPacksToItems(boughtPacks)}
      </Transition.Group>
    </>
  )
}
 
export default MyPacksList