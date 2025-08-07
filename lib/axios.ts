import axios from "axios";

const instance = axios.create({
  baseURL: "https://your-adonis-backend.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default instance;
