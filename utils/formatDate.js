export const dateTime = d => {
  const date = new Date(d)
  const day = date.getDate()
  const month = date.getMonth() +  1
  const year = date.getFullYear()
  const hours = 
    date.getHours() < 10 ? 
      "0" + date.getHours()
      : date.getHours()
  const minutes = 
    date.getMinutes() < 10 ? 
      "0" + date.getMinutes()
      : date.getMinutes()
  const seconds = 
    date.getSeconds() < 10 ? 
      "0" + date.getSeconds()
      : date.getSeconds()
  const newDate =
    day +
    ". " +
    month +
    ". " +
    year +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  return newDate
}