import cookies from "js-cookie"

export const setLocal = lang => {
  cookies.set("local", lang, { expires: 365 , sameSite: 'None', secure: true })
}

export const changeLang = newLang => {
  setLocal(newLang)
}

export const checkLocal = () => {
  const languages = [
    "cz",
    "en"
  ] 
  if(cookies.get("local")===undefined) setLocal("en")
  else if(!languages.find(lang => lang === cookies.get("local"))) setLocal("en")
}