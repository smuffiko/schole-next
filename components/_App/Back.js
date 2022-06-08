import Router from "next/router"
import { Icon } from "semantic-ui-react"

const Back = ({ t }) => {
  return (
    <>
      <h3 onClick={()=>Router.back()} style={{color:"white",cursor:"pointer"}}>
        <Icon name="arrow alternate circle left outline"/>{t.back}
      </h3>
    </>
  )
}
 
export default Back