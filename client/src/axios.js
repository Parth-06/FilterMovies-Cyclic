import axios from "axios";

/** base url to make requests to the the movie database*/
const config = {
  headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "text/plain" },
};
const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  https: config,
});
// const instance=axios.create({
//   baseURL:"https://api.themoviedb.org/3",
// })

export default instance;
