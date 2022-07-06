import Router from "next/router"
import { Header, Icon, Segment, Accordion, Button, Label, List } from "semantic-ui-react"
import { dateTime } from "../../utils/formatDate"

const AccountOrders = ({ orders, t }) => {
  
  const mapOrdersToPanels = orders => (
    orders.map(order => ({
      key: order._id,
      title: {
        content: 
          <>
            <Label color="purple" content={dateTime(order.createdAt)} />
            <Label
              content={order._id}
              icon="hashtag"
              basic
              horizontal
              style={{ marginLeft: "1em" }}
            />
          </>
      },
      content: {
        content: (
          <>
            <List.Header as="h3">
              {t.account.total} {order.total},- Kč
            </List.Header>
            <List divided>
              {order.packs.map(p => (
                <List.Item key={p.pack._id}>
                  <List.Content>
                    <List.Header>{p.pack.title} - {p.pack.price},- Kč</List.Header>
                    <List.Description>
                      {p.pack.description}
                      <List>
                        {p.pack.articles.map(a => (
                          <List.Item key={a.article_id}>
                            <List.Content>
                              <List.Header>{a.article.title}</List.Header>
                              <List.Description>{a.article.description}</List.Description>
                            </List.Content>
                           </List.Item>
                        ))}
                      </List>
                    </List.Description>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </>
        )
      }
    }))
  )

  return (
    <>
      <Segment>
         <Header as="h2">
            <Icon name="history" />
            {t.account.orderHistory}
         </Header>
         {orders.length === 0 ? (
        <Segment inverted tertiary color="grey" textAlign="center">
          <Header icon>
            <Icon name="copy outline" />
            {t.account.noPastOrders}
          </Header>
          <div>
            <Button onClick={() => Router.push("/packs")} color="orange">
              {t.account.viewPacks}
            </Button>
          </div>
        </Segment>
      ) : (
        <Accordion
          fluid
          styled
          exclusive={false}
          panels={mapOrdersToPanels(orders)}
        />
      )}
      </Segment>
    </>
  )
}
 
export default AccountOrders