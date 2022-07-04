import Router from "next/router"
import { Item, Header, Button, Icon, Container } from "semantic-ui-react"


const CartItemList = ({ cartPacks, handleRemoveFromCart, t }) => {

  const mapPacksToListItems = () => (
    cartPacks.map(pack => (
      <Item key={pack._id}>
        <Item.Content>
          <Item.Extra>
            <Button
              basic
              icon="remove"
              style={{position:"absolute",right:"0"}}
              onClick={() => handleRemoveFromCart(pack)}
            />
          </Item.Extra>
          <Item.Header as="a" onClick={()=> Router.push(`/pack?_id=${pack._id}`)} >{pack.title}</Item.Header>
          <Item.Meta>{pack.price},- Kč</Item.Meta>
          <Item.Description>{pack.description}</Item.Description>
        </Item.Content>
      </Item>
    ))
  )

  return (
    <>
      {cartPacks.length === 0 ? (
        <Container fluid textAlign="center">
          <Header icon>
            <Icon name="shopping basket" />
            {t.cart.noPacks}
          </Header>
          <div>
            <Button color="purple" onClick={() => router.push("/packs")}>
              {t.cart.viewPacks}
            </Button>
          </div>
        </Container>
      ) : (
        <Item.Group divided>
          {mapPacksToListItems()}
        </Item.Group>
      )}
    </>
  )
}
 
export default CartItemList