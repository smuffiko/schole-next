import React from "react"
import { parseCookies } from "nookies"
import baseUrl from "../utils/baseUrl"
import { Container, Segment, Message } from "semantic-ui-react"
import CartItemList from "../components/Cart/CartItemList"
import CartSummary from "../components/Cart/CartSummary"
import cookie from "js-cookie"

const Cart = ({ packs, t }) => {
  const [cartPacks, setCartPacks] = React.useState(packs)
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const handleRemoveFromCart = async pack => {
    setError("")
    const url = `${baseUrl}/api/cart?pack=${pack._id}`
    const token = cookie.get("token")
    await fetch(url, {
      method: "DELETE",
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
    }).then(packs => {
      const newPacks = packs.map(d=>d.pack)
      setCartPacks(newPacks)
    }).catch(error=>{
      setError(error.message)
    })
  }

  const handleCheckout = async paymentData => { // todo change data (url) at real server
    setLoading(true)
    setError("")
    const url = `${baseUrl}/api/checkout`
    const token = cookie.get("token")
    const payload = { paymentData }
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(payload)
    }).then(async response=> {
      if(!response.ok) {
        const er = await response.text()
        throw new Error(er)
      }
      return response.text()
    }).then(() => {
      setCartPacks([])
      setSuccess(true)
    }).catch(error=>{
      setError(error.message)
    }).finally(()=>{
      setLoading(false)
    })
  }

  return (
    <>
    <Container>
      <Message error
        header={t.error}
        content={error}
        hidden={!Boolean(error)}
      />
      <Segment loading={loading}>
        <CartItemList 
          cartPacks={cartPacks}
          setCartPacks={setCartPacks}
          handleRemoveFromCart={handleRemoveFromCart}
          t={t}
        />
        <CartSummary
          cartPacks={cartPacks}
          handleCheckout={handleCheckout}
          success={success}
          t={t}
        />
      </Segment>
    </Container>
    </>
  )
}
 
export default Cart

export const getServerSideProps = async ctx => {
  const { token } = parseCookies(ctx)
  if (!token) {
    return { packs: [] }
  } 
  const url = `${baseUrl}/api/cart`;
  const packs = await fetch(url,{
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
  }).then(data => {
    return data.map(d=>d.pack)
  })
  return { props: { packs: packs } }
}