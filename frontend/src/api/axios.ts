import axios from "axios";

const API = axios.create({
  baseURL: "https://tasky-2.onrender.com/api",
  withCredentials: true, 
});

export default API;
