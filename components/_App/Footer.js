import { Container, Icon, List } from "semantic-ui-react"
import Link from "next/link"

const Footer = ({ t }) => {
  return (
  <>
      <Container textAlign="center">
        <footer>
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
  );
}
 
export default Footer;