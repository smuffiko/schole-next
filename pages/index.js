import { Icon, Header, Segment, Container } from "semantic-ui-react"

const Home = ({ t }) => {
  return (
    <>
      <div id="home">
      {Object.keys(t.schole.content).map(seg=>{
        var inverted = true
        if(seg%2) inverted = false
        return(
          <Segment inverted={inverted} style={{backgroundColor: inverted ? "#1D101F" : "#FCEDFF"}} key={seg} textAlign="center" vertical>
            <Container>
              <Header as="h1" inverted={inverted}>
                {t.schole.content[seg].header}
              </Header>
              <p>{t.schole.content[seg].content}</p>
            </Container>
          </Segment>
        )
      })}
      </div>
    </>
  )
}
 
export default Home