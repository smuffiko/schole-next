import Head from "next/head"
import { Container, Segment } from "semantic-ui-react"

import Header from "./Header"
import HeadContent from "./HeadContent"
import Footer from "./Footer"

const Layout = ({ children, user, t }) => {
  return(
  <>
    <Head>
      <HeadContent />
      <title>Scholé - next.js</title>
    </Head>
    <Header user={user} t={t} />
    <Container fluid className="page">{children}</Container>
   <Footer t={t} />
  </>
  )
}

export default Layout