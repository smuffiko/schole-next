import React from "react"
import { Button} from "semantic-ui-react"
import baseUrl from "../../utils/baseUrl"
import cookie from "js-cookie"

const AddPackToCart = ({ pack, setIsInCart, setError, t }) => {
  const [loading, setLoading] = React.useState(false)

  const handleAddPackToCart = async()=> {
    setLoading(true)
    setError("")

    const url = `${baseUrl}/api/cart`
    const token = cookie.get("token")
    const payload = { pack: pack._id } 
    await fetch(url,{
      method: "PUT",
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
      return response.json()
    }).then(cart => {
      setIsInCart(true)
    }).catch(error=>{
      setError(error.message)
      setLoading(false)
    })
  }

  return (
  <>
    <Button
      type="button"
      content={t.cart.addToCart}
      icon="plus cart"
      color="purple"
      label={`${t.cart.price}: ${pack.price},- Kč`}
      floated="right"
      loading={loading}
      disabled={loading}
      onClick={handleAddPackToCart}
    />
  </>
  )
}
 
export default AddPackToCart