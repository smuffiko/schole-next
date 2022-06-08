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
                <div dangerouslySetInnerHTML={{__html: t.schole.content[seg].header}}></div>
              </Header>
              <div dangerouslySetInnerHTML={{__html: t.schole.content[seg].content}}></div>
            </Container>
          </Segment>
        )
      })}
      </div>
    </>
  )
}
 
export default Home