import React from "react"
import StripeCheckout from "react-stripe-checkout"
import { Button, Segment, Divider } from "semantic-ui-react"
import calculateCartTotal from "../../utils/calculateCartTotal"


const CartSummary = ({ cartPacks, handleCheckout, success, t }) => {
  const [cartAmount, setCartAmount] = React.useState(0)
  const [stripeAmount, setStripeAmount] = React.useState(0)
  const [isCartEmpty, setCartEmpty] = React.useState(false)

  React.useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(cartPacks)
    setCartAmount(cartTotal)
    setStripeAmount(stripeTotal)
    setCartEmpty(cartPacks.length === 0)
  }, [cartPacks])

  return (
    <>
      <Divider />
      <Segment clearing size="large"> {/**todo local whole form */}
        <strong>Sub total:</strong> {cartAmount} ,- Kč 
        <StripeCheckout
          name="Scholé"
          amount={stripeAmount}
          currency="CZK"
          stripeKey={process.env.STRIPE_PUBLISH_KEY}
          token={handleCheckout}
          description={`Your total is ${cartAmount}`}
          panelLabel={`Zaplať! ${cartAmount},-`}
          triggerEvent="onClick"
        >
          <Button
            icon="cart"
            disabled={isCartEmpty || success}
            color="teal"
            floated="right"
            content="Checkout"
          />
        </StripeCheckout>
      </Segment>
    </>
  );
}
 
export default CartSummary