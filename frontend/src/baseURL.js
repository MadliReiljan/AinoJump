const baseURL = process.env.NODE_ENV === "production"
  ? "https://marionvs23.ikt.khk.ee/ainojump/backend"
  : "http://localhost:8000";

export default baseURL;