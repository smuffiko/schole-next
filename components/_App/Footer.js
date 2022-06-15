import { useRouter } from "next/router"
import { Container, Icon, List, Flag } from "semantic-ui-react"
import Link from "next/link"
import { changeLang } from "../../utils/local"
import locales from "../../data/locales.json"

const Footer = ({ t }) => {
  const router = useRouter()

  const changeLangClick = (newLang) => {
    changeLang(newLang)
    t = locales[newLang]
    router.push(router.pathname)
  }
  return (
    <>
      <Container textAlign="center">
        <footer>
          <div style={{color:"white"}}>
            <Flag style={{cursor:"pointer"}} name="cz" onClick={()=>changeLangClick("cz")}/>
            <Flag style={{cursor:"pointer"}}  name="gb" onClick={()=>changeLangClick("en")}/>
          </div>
          <List horizontal divided link size="small" inverted>
            <List.Item>
              <Link href='/contact'>
                {t.footer.contact}
              </Link>
            </List.Item>
            <List.Item>
              <Link href='/terms'>
                {t.footer.terms}
              </Link>
            </List.Item>
            <List.Item>
              <Link href='/privacy'>
                {t.footer.privacy}
              </Link>
            </List.Item>
            <List.Item>
              <Icon name="git"/>
              <Link href="https://github.com/smuffiko">smuffiko</Link>
            </List.Item>
          </List>
        </footer>
      </Container>
    </>
  )
}
 
export default Footer