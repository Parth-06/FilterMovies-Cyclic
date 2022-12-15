import axios from "../../axios";
import React, { useEffect, useRef, useState } from "react";
import "./Row.css";
import SingleRow from "./SingleRow.js";

const Row = ({ title, fetchUrl }) => {
  const [movies, setmovies] = useState([]);
  const [showarrow, setshowarrow] = useState(false);
  const arrowref = useRef([]);
  const [moviedata, setMoviedata] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setmovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const request = await fetch(fetchUrl, {
  //       method: "GET",
  //       headers: {
  //         "Access-Control-Allow-Origin": "https://api.themoviedb.org/3",
  //         "Content-Type": "text/plain",
  //       },
  //     });
  //     const res = await request.json();
  //     setmovies(res.results);
  //   };

  //   fetchData();
  // }, [fetchUrl]);

  const handlerightscroll = () => {
    arrowref.current.scrollBy(1254, 0);
  };
  const handleleftscroll = () => {
    arrowref.current.scrollBy(-1254, 0);
  };

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch("/get_movie", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      setMoviedata(data);
    };
    fetchMovie();
  }, []);
  return (
    <div
      className="main_row"
      onMouseEnter={() => setshowarrow(true)}
      onMouseLeave={() => setshowarrow(false)}
    >
      <div className="left_silder" onClick={handleleftscroll}>
        <i
          className="fas fa-chevron-left"
          style={showarrow ? {} : { display: "none" }}
        ></i>
      </div>
      <div className="right_silder" onClick={handlerightscroll}>
        <i
          className="fas fa-chevron-right"
          style={showarrow ? {} : { display: "none" }}
        ></i>
      </div>
      <div
        className="row"
        ref={(element) => {
          arrowref.current = element;
        }}
      >
        <h2>{title}</h2>

        <div className="posters_main">
          {movies.map((movie) => {
            return (
              <SingleRow movie={movie} key={movie.id} moviedata={moviedata} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Row;
