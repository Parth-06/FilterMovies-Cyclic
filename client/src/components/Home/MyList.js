import React, { useEffect, useState } from "react";
import "./MyList.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Nav from "../Navbar/Nav";
import { useNavigate } from "react-router-dom";

const MyList = () => {
  const [moviedata, setMoviedata] = useState([]);
  const base_url = "https://image.tmdb.org/t/p/original/";
  const [remove, setremove] = useState("");
  const [userdata, setUserdata] = useState("");
  const navigate = useNavigate();
  console.log(moviedata);

  const removeList = async (movie) => {
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
        id: movie,
      }),
    });

    if (res.status === 210) {
    }
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
      console.log(data);
      setremove("Next");
    };
    fetchMovie();
  }, []);

  useEffect(() => {
    const Callmainpage = async () => {
      try {
        const res = await fetch("/home", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        });
        const user = await res.json();
        setUserdata(user);
        if (!res.status === 200) {
          const error = new Error(res.error);
          throw error;
        }
      } catch (err) {
        console.log(err);
        toast.error("Please Login For Better Experience");
        navigate("/login");
      }
    };
    Callmainpage();
  }, []);

  return (
    <>
      <Nav userdata={userdata} />
      <div className="MyList">
        <h4>My List</h4>
        <div className="movie_row">
          {moviedata.map((movie) => {
            return (
              <div className="movie_card" key={movie.id}>
                <img
                  src={`${base_url}${movie.backdrop_path}`}
                  alt={movie.name}
                  className="movie_posters"
                  onClick={() =>
                    navigate("/player", {
                      state: { movie: movie },
                    })
                  }
                />
                <div className="movie_del">
                  <h3
                    onClick={() =>
                      navigate("/player", {
                        state: { movie: movie },
                      })
                    }
                  >
                    {movie?.title || movie?.name || movie?.original_name}
                  </h3>
                  <div
                    className="icons"
                    id="list"
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
                    <i
                      className="fas fa-check"
                      title="Remove"
                      onClick={() => removeList(movie)}
                    ></i>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MyList;
