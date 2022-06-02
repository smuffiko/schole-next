const baseUrl =
  process.env.NODE_ENV === "production"
    ? "somebaseurlneedstochange todo"
    : "http://localhost:3000"

export default baseUrl