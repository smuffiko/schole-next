const calculateCartTotal = packs => {
  const total = packs.reduce((acc, el) => {
    acc += el.price
    return acc
  }, 0)
  const cartTotal = total
  const stripeTotal = Number((total * 100))

  return { cartTotal, stripeTotal }
}

export default calculateCartTotal
