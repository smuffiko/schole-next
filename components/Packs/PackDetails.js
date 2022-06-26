import React from "react"
import { Header, Label, Segment, Button } from "semantic-ui-react"
import { dateTime } from "../../utils/formatDate"
import AddPackToCart from "./AddPackToCart"

const PackDetails = ({ pack, user, cart }) => {
  const { title, content, language, createdAt } = pack
  const isBought = false // todo
  const [isInCart, setIsInCart] = React.useState(cart.some(doc => pack._id === doc.pack._id ))

  return (
    <>
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
              content={isBought ? "is bought" : isInCart && "is in cart"} />)
          : <AddPackToCart pack={pack} setIsInCart={setIsInCart} /> }
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