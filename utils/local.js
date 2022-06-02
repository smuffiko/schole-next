import cookies from "js-cookie"
import locales from "../data/locales.json"

export const setLocal = lang => {
  cookies.set("local", lang, { expires: 365 , sameSite: 'None', secure: true })
}

export const changeLang = newLang => {
  setLocal(newLang)
}

export const checkLocal = () => {
  if(cookies.get("local")===undefined) setLocal("en")
}