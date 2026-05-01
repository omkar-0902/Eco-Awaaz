import axios from "axios";

const API = axios.create({
  baseURL: "https://eco-awaaz.onrender.com",
});

export default API;