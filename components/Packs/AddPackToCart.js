import React from "react"
import { Button} from "semantic-ui-react"
import baseUrl from "../../utils/baseUrl"
import cookie from "js-cookie"

const AddPackToCart = ({ pack, setIsInCart }) => {
  const [loading, setLoading] = React.useState(false) 

  const handleAddPackToCart = async()=> {
    setLoading(true)
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
      console.log("data cart?", cart) // todo 
      setIsInCart(true)
    }).catch(error=>{
      console.log(error.message) // todo 
      setLoading(false)
    })
  }

  return (
    <Button
      type="button"
      content="Add to cart" //todo local
      icon="plus cart"
      color="purple"
      floated="right"
      loading={loading}
      disabled={loading}
      onClick={handleAddPackToCart}
    />
  )
}
 
export default AddPackToCart