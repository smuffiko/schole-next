import React from "react"
import { Header, Label, Segment, Button, Message } from "semantic-ui-react"
import { dateTime } from "../../utils/formatDate"
import AddPackToCart from "./AddPackToCart"

const PackDetails = ({ pack, user, cart, t }) => {
  const { title, content, language, createdAt, price } = pack
  const isBought = false // todo
  const [isInCart, setIsInCart] = React.useState(cart.some(doc => pack._id === doc.pack._id ))
  const [error, setError] = React.useState("")

  return (
    <>
      <Message error
        header={t.error}
        content={error}
        hidden={!Boolean(error)}
      />
      <Segment>       
        { user.role==="user" && (<>
          { isBought || isInCart ? (
            <Label
              ribbon
              color="purple"
              style={{
                position: "absolute",
                top: "-1px",
                left: "-15px"
              }}
              content={isBought ? t.pack.isBought : isInCart && t.pack.isInCart } />)
          : <AddPackToCart pack={pack} setIsInCart={setIsInCart} t={t} setError={setError} /> }
        </>)}
        <Header as="h2">
          {title}
        </Header>
        <Label>{language.toUpperCase()} {dateTime(createdAt)}</Label>
        <div style={{whiteSpace:"pre-line", marginTop:"1em"}} dangerouslySetInnerHTML={{__html: content}}></div>   
      </Segment>
    </>
  )
}
 
export default PackDetails