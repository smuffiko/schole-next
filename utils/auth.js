import cookie from "js-cookie"
import Router from "next/router"

export const handleLogin = token => {
  cookie.set("token", token, { expires: 7, SameSite: 'None', secure: true })
  Router.push("/account")
}

export const handleLogout = () => {
  cookie.remove("token")
  window.localStorage.setItem("logout", Date.now())
  Router.push("/login")
}


export const redirectUser = (ctx, location) => {
  ctx ? (
    ctx.req ?
      ctx.res.writeHead(302, { Location: location }).end()
      : Router.push(location)
  ) : Router.push(location)
}