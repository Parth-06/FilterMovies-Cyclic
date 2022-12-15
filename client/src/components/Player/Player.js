import React, { useEffect, useRef, useState } from "react";
import "./Player.css";
import axios from "../../axios";
import requests from "../../request";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../../Spinner";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const base_url = "https://image.tmdb.org/t/p/original/";
const url =
  "https://ik.imagekit.io/ma2ncam6qv/Untitled_R7srzMTPv.mp4?ik-sdk-version=javascript-1.4.3&updatedAt=1663707609125";
const Player = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { movie } = location.state;
  const [movies, setmovies] = useState([]);
  const [moviedata, setMoviedata] = useState([]);
  const arrowref = useRef([]);
  var random = movies.data?.results.sort(() => 0.5 - Math.random()).slice(0, 9);

  useEffect(() => {
    async function fetchdata() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      setmovies(request);
    }
    fetchdata();
  }, []);

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
  const arrow = (index) => {
    arrowref.current[index].style.display = "flex";
  };

  const arrowleave = (index) => {
    arrowref.current[index].style.display = "none";
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addList = async (movieID) => {
    const addMovie = [...moviedata, movieID];
    setMoviedata(addMovie);
    toast.success("Added");

    const res = await fetch("/add_id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id: movieID,
      }),
    });
  };
  const removeList = async (movieID) => {
    const removeMovie = moviedata.filter((mov) => {
      return mov.id !== movie.id;
    });
    setMoviedata(removeMovie);
    toast.error("Removed");
    const res = await fetch("/remove_id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id: movieID,
      }),
    });
  };

  const cards = (items) => {
    navigate("/player", {
      state: { movie: items },
    });
    window.scrollTo(0, 0);
  };
  return (
    <>
      {movies.data === undefined ? (
        <div className="spinner_page">
          <Spinner />
        </div>
      ) : (
        <div className="player">
          <div className="back">
            <i class="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
          </div>

          <video
            src={url}
            autoPlay
            muted
            loop
            controls
            className="videoPlayer"
          />
          <div className="movieinfo">
            <h1> {movie?.title || movie?.name || movie?.original_name}</h1>
            <p>{movie?.overview}</p>
            <div
              className="icons"
              id="player"
              style={{ color: "white", marginTop: "0.8rem" }}
            >
              <i
                className="far fa-play-circle"
                title="Play"
                onClick={() =>
                  navigate("/player", {
                    state: { movie: movie },
                  })
                }
              ></i>
              {moviedata.some((item) => {
                return item.id === movie.id;
              }) ? (
                <i
                  className="fas fa-check"
                  title="Remove"
                  onClick={() => removeList(movie)}
                ></i>
              ) : (
                <i
                  className="fas fa-plus-circle"
                  onClick={() => addList(movie)}
                  title="Add to List"
                ></i>
              )}
            </div>
          </div>
          <div className="more">
            <h1>More Like This</h1>
            <div className="more_card">
              {random.slice(0, 9).map((items, index) => {
                return (
                  <div
                    className="cards"
                    key={items.id}
                    onMouseEnter={() => arrow(index)}
                    onMouseLeave={() => arrowleave(index)}
                    onClick={() => cards(items)}
                  >
                    <div className="thumbnail">
                      <div
                        className="play"
                        ref={(element) => {
                          arrowref.current[index] = element;
                        }}
                      >
                        <i className="far fa-play-circle"></i>
                      </div>

                      <img
                        src={`${base_url}${items.backdrop_path}`}
                        alt={items.name}
                        className="thumbnail"
                      />
                    </div>
                    <div className="allinfo">
                      <h2>
                        {items.name || items.title || items.original_name}
                      </h2>
                      <p>{items?.overview}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Player);
