import React from "react"
import Router from "next/router"
import { Button, Container, Header, Icon, Segment } from "semantic-ui-react"
import MyPacksList from "../components/MyPacks/MyPacksList"

const MyPacks = ({ boughtPacks, boughtArticles, t }) => {
  return (
    <>
      <Container>
        { boughtPacks.length === 0 ? (
          <>
            <Segment fluid textAlign="center">
              <Header icon>
                <Icon name="gift" />
                {t.myPacks.noPacks}
              </Header>
              <div>
                <Button color="purple" onClick={() => Router.push("/packs")}>
                  {t.myPacks.viewPacks}
                </Button>
              </div>
            </Segment>
          </>
        ) : (
          <>
            <MyPacksList boughtPacks={boughtPacks} t={t} />
          </>
        )}
      </Container>
    </>
  )
}
 
export default MyPacks