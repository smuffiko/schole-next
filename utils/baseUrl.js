const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://schole-next.vercel.app"
    : "http://localhost:3000"

export default baseUrl