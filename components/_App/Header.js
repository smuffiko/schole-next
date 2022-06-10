import React, { useEffect } from "react"
import { Menu, Container, Icon} from "semantic-ui-react"
import Link from "next/link"
import Router, { useRouter } from "next/router"
import { handleLogout } from "../../utils/auth"
import { isMobile } from "react-device-detect"
import NProgress from "nprogress"

Router.events.on("routeChangeStart", ()=> NProgress.start())
Router.events.on("routeChangeComplete", ()=> NProgress.done())
Router.events.on("routeChangeError", ()=> NProgress.done())

const Header = ({ user, t }) => {
  const router = useRouter()
  const isNew = user && user.role === "new" 
  const isUser = user && user.role === "user" 
  const isRoot = user && user.role === "root"
  const isAdmin = user && user.role === "admin"
  const isAdminOrRoot = isAdmin || isRoot
  const isLogged = isAdminOrRoot || isNew || isUser
  const [isVisible, setIsVisible] = React.useState()

  useEffect(()=>{
    if(isMobile) setIsVisible(false)
    else setIsVisible(true)
  },[])

  const handleMenu = ()=> {
    setIsVisible(!isVisible)
  }

  const isActive = route => route === router.pathname

  return ( 
    <Menu inverted stackable fluid id="menu" style={isMobile ? {fontSize: "1rem"} : null}>
      <Container>
        { isVisible && ( // menu is visible or hidden(responsive)
          <> 
            {/* everyone - HOME */}
            <Link href="/" passHref>
              <Menu.Item header active={isActive("/")}>
                <Icon name="home"/>
                {t.menu.schole}
              </Menu.Item>
            </Link>
            { isLogged ? ( /* for logged users */
              <>
                { (isUser || isAdminOrRoot) && /* user, root, admin - PACKS */
                  (
                    <>
                      <Link href="/packs" passHref>
                        <Menu.Item header active={isActive("/packs")}>
                        <Icon name="gift"/>
                        {t.menu.packs}
                        </Menu.Item>
                      </Link>
                      { isUser ? ( /* user - MY PACKS, CART */
                          <>
                            <Link href="/my-packs" passHref>
                              <Menu.Item header active={isActive("/my-packs")}>
                                <Icon name="gift"/>
                                {t.menu.myPacks}
                              </Menu.Item>
                            </Link> 
                            <Link href="/cart" passHref>
                              <Menu.Item header active={isActive("/cart")}>
                                <Icon name="cart" />
                                {t.menu.cart}
                              </Menu.Item>
                            </Link> 
                          </>
                        ):( /* admin, root - ARTICLES */
                          <>
                            <Link href="/articles" passHref>
                              <Menu.Item header active={isActive("/articles")}>
                                <Icon name="file alternate outline" />
                                {t.menu.articles}
                              </Menu.Item>
                            </Link> 
                          </>
                        )}

                    </>
                  ) /* user, root, admin */
                } 
                {/* new, user, root, admin - ACCOUNT, LOGOUT */}
                  <Link href="/account" passHref>
                    <Menu.Item header active={isActive("/account")}>
                      <Icon name="user" />
                      {t.menu.account}
                    </Menu.Item>
                  </Link> 
                  <Menu.Item header onClick={handleLogout}>
                    <Icon name="log out" />
                    {t.menu.logout}
                  </Menu.Item>
              </>
            ):( /* not logged users - LOGIN, SIGNUP */
              <>
                <Link href="/login" passHref>
                  <Menu.Item header active={isActive("/login")}>
                    <Icon name="sign in" />
                      {t.menu.login}
                  </Menu.Item>
                </Link> 
                <Link href="/signup" passHref>
                  <Menu.Item header active={isActive("/signup")}>
                    <Icon name="signup" />
                    {t.menu.signup}
                  </Menu.Item>
                </Link> 
              </>
            )}
          </>
        )} 
        { isMobile && ( // for mobile devices show menu button
          <Menu.Item link onClick={handleMenu} >
            <Icon name="bars"/>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  )
}
 
export default Header