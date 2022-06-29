import "../styles/globals.css"
import "../styles/nprogress.css"
import App from "next/app"
import React from "react"
import Router from "next/router"
import Layout from '../components/_App/Layout'
import { parseCookies, destroyCookie } from "nookies"
import baseUrl from "../utils/baseUrl"
import locales from "../data/locales.json"
import { checkLocal } from "../utils/local"
import { redirectUser } from "../utils/auth"

checkLocal()

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    if(ctx.req) {
      // maybe once i will need to change it -> todo (url)
      const host = ctx.req.headers.host
      if(process.env.NODE_ENV === "production"
        && host !== "schole-next.vercel.app"
      ) redirectUser(ctx, "https://schole-next.vercel.app")
    }

    const { token, local } = parseCookies(ctx)

    let pageProps = {}

    let t = locales[local] === undefined
      ? locales["en"]
      : locales[local]

    pageProps.t = t

    if(!token) {
      // not logged user  
      if(ctx.pathname === "/packs"
        || ctx.pathname === "/pack"
        || ctx.pathname === "/my-packs"
        || ctx.pathname === "/cart"
        || ctx.pathname === "/articles"
        || ctx.pathname === "/article"
        || ctx.pathname === "/account"
      )
        redirectUser(ctx, "/")
    } else {
      // if logged user
      const url = `${baseUrl}/api/account`
      await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      }).then(async response => {
        if(!response.ok) {
          const er = await response.text()
          throw new Error(er)
        }
        return await response.json()
      }).then(async user => {
        // set user to page props
        pageProps.user = user

        // set roles
        const isNew = user.role === "new"
        const isUser = user.role === "user"
        const isAdmin = user.role === "admin"
        const isRoot = user.role === "root"

        // everyone logged -> login, signup redirect to home
        if(ctx.pathname === "/login" || ctx.pathname === "/signup")
          redirectUser(ctx, "/")

        if(isNew && ( // protected route for new user
          ctx.pathname === "/packs"
          || ctx.pathname === "/my-packs"
          || ctx.pathname === "/cart"
          || ctx.pathname === "/articles"
        ))
          redirectUser(ctx, "/")
        
        if(isUser && (  // protected route for user
          ctx.pathname === "/articles"
        ))
          redirectUser(ctx, "/")

        if((isAdmin || isRoot) && ( // protected route for admin & root
          ctx.pathname === "/my-packs"
          || ctx.pathname === "/cart"
        ))
          redirectUser("/")
        
        if(isUser) { // for user get cart
          const url = `${baseUrl}/api/cart`
          await fetch(url,{
            method: "GET",
            headers: {
              "Content-type": "application/json",
              "authorization": token
            }
          }).then(async response => {
            if(!response.ok) {
              const er = await response.text()
              throw new Error(er)
            }
            return await response.json()
          }).then(cart => {
            pageProps.cart = cart
          }).catch(error => {
            console.log("error getting cart") // todo local or smt
          })
        } else pageProps.cart = []
      }).catch(error => { // todo send error message
        // 1) Throw out invalid token
        destroyCookie(null, "token")
        // 2) Redirect to login
        redirectUser(ctx, "/login")
      })
    }
    return { pageProps }
  }

  componentDidMount() {
    window.addEventListener("storage", this.syncLogout)
  }

  syncLogout = event => {
    if (event.key === "logout") {
      Router.push("/login")
    }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    )
  }
}

export default MyApp