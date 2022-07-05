import { Message, Header, Segment, Container, Button } from "semantic-ui-react"

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

        <div style={{backgroundColor: "#FCEDFF", padding:"3rem 0"}}>
          <Container>
            <Header as="h1">Test</Header>
            <Header as="h2">Messages:</Header>
              <Message color='red'>Red</Message>
              <Message color='orange'>Orange</Message>
              <Message color='yellow'>Yellow</Message>
              <Message color='olive'>Olive</Message>
              <Message color='green'>Green</Message>
              <Message color='teal'>Teal</Message>
              <Message color='blue'>Blue</Message>
              <Message color='violet'>Violet</Message>
              <Message color='purple'>Purple</Message>
              <Message color='pink'>Pink</Message>
              <Message color='brown'>Brown</Message>
              <Message color='black'>Black</Message>
            <Header as="h2">Buttons basic:</Header>
              <Button basic>Standard</Button>
              <Button basic color='red'>Red</Button>
              <Button basic color='orange'>Orange</Button>
              <Button basic color='yellow'>Yellow</Button>
              <Button basic color='olive'>Olive</Button>
              <Button basic color='green'>Green</Button>
              <Button basic color='teal'>Teal</Button>
              <Button basic color='blue'>Blue</Button>
              <Button basic color='violet'>Violet</Button>
              <Button basic color='purple'>Purple</Button>
              <Button basic color='pink'>Pink</Button>
              <Button basic color='brown'>Brown</Button>
              <Button basic color='grey'> Grey</Button>
              <Button basic color='black'>Black</Button>
            <Header as="h2">Buttons colored:</Header>
              <Button color='red'>Red</Button>
              <Button color='orange'>Orange</Button>
              <Button color='yellow'>Yellow</Button>
              <Button color='olive'>Olive</Button>
              <Button color='green'>Green</Button>
              <Button color='teal'>Teal</Button>
              <Button color='blue'>Blue</Button>
              <Button color='violet'>Violet</Button>
              <Button color='purple'>Purple</Button>
              <Button color='pink'>Pink</Button>
              <Button color='brown'>Brown</Button>
              <Button color='grey'>Grey</Button>
              <Button color='black'>Black</Button>
          </Container>
          <Segment inverted style={{backgroundColor:"#1D101F", padding:"2rem 0", marginBottom:"0"}} >
            <Container>
              <Header as="h2" style={{color:"white"}}>Buttons inverted:</Header>
                <Button inverted>Standard</Button>
                <Button inverted color='red'> Red </Button>
                <Button inverted color='orange'> Orange </Button>
                <Button inverted color='yellow'> Yellow </Button>
                <Button inverted color='olive'> Olive </Button>
                <Button inverted color='green'> Green </Button>
                <Button inverted color='teal'> Teal </Button>
                <Button inverted color='blue'> Blue </Button>
                <Button inverted color='violet'> Violet </Button>
                <Button inverted color='purple'> Purple </Button>
                <Button inverted color='pink'> Pink </Button>
                <Button inverted color='brown'> Brown </Button>
                <Button inverted color='grey'> Grey </Button>
                <Button inverted color='black'> Black </Button>
              <Header as="h2" style={{color:"white"}}>Buttons basic inverted:</Header>
                <Button basic inverted>Standard</Button>
                <Button basic inverted color='red'>Red </Button>
                <Button basic inverted color='orange'> Orange </Button>
                <Button basic inverted color='yellow'> Yellow </Button>
                <Button basic inverted color='olive'> Olive </Button>
                <Button basic inverted color='green'> Green </Button>
                <Button basic inverted color='teal'> Teal </Button>
                <Button basic inverted color='blue'> Blue </Button>
                <Button basic inverted color='violet'> Violet </Button>
                <Button basic inverted color='purple'> Purple </Button>
                <Button basic inverted color='pink'> Pink </Button>
                <Button basic inverted color='brown'> Brown </Button>
                <Button basic inverted color='grey'> Grey </Button>
                <Button basic inverted color='black'> Black </Button>
            </Container>
          </Segment>
        </div>
      </div>
    </>
  )
}
 
export default Home