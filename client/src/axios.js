import axios from "axios";

const config = {
  headers: {
    "Access-Control-Allow-Origin": "https://cautious-dog-scrubs.cyclic.app",
    "Content-Type": "text/plain",
  },
};
const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  https: config,
});

export default instance;
