import { useRouter } from "next/router"
import { Flag } from "semantic-ui-react"
import { changeLang } from "../../utils/local"
import locales from "../../data/locales.json"

const AccountLang = ({ t }) => {
  const router = useRouter()

  const changeLangClick = (newLang) => {
    changeLang(newLang)
    t = locales[newLang]
    router.push(router.pathname)
  }

  return (
    <>
      <Flag style={{cursor:"pointer"}} name="cz" onClick={()=>changeLangClick("cz")}/>
      <Flag style={{cursor:"pointer"}}  name="gb" onClick={()=>changeLangClick("en")}/>
    </>
  )
}
 
export default AccountLang