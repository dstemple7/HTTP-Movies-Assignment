import React, { useState, useEffect } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import axios from "axios";

const initialItem = {
  id: "",
  title: "",
  director: "",
  metascore: "",
  stars: [],
};

const UpdateMovie = props => {
  const location = useLocation();
  const params = useParams();
  const { push } = useHistory();
  const [movie, setMovie] = useState(initialItem);
  const [movieList, setMovieList] = useState([]);
  
  console.log(movieList)

  // when the component mounts:
  // populate to form with the item data
  // 1. if we have data at `location.state.item` use that
  // 2. else, make api call to fetch data by the id

  useEffect(() => {
    if (location.state) {
      setMovie(location.state);
    } else {
      // make api request for item data
      // "/itemById/:id"
      axios
        .get(`http://localhost:5000/api/movies/${params.id}`)
        .then(res => setMovie(res.data))
        .catch(err => console.log(err));
    }
  }, [params.id, location.state]);

  const changeHandler = ev => {
    ev.persist();
    let value = ev.target.value;
    if (ev.target.name === "metascore") {
      value = parseInt(value, 10);
    }

    setMovie({
      ...movie,
      [ev.target.name]: value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // make a PUT request to edit the item
    axios
      .put(`http://localhost:5000/api/movies/${movie.id}`, movie)
      .then(res => {
        // res.data ==> full array with updated item
        props.setMovie(res.data);
        push(`/movies/${movie.id}`);
        setMovieList(res.data)
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="movie-card">
      <h2>Update Movie</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          onChange={changeHandler}
          placeholder="title"
          value={movie.title}
        />
        <div className="baseline" />

        <input
          type="string"
          name="director"
          onChange={changeHandler}
          placeholder="director"
          value={movie.director}
        />
        <div className="baseline" />

        <input
          type="number"
          name="metascore"
          onChange={changeHandler}
          placeholder="metascore"
          value={movie.metascore}
        />
        <div className="baseline" />

        <button className="md-button form-button">Update</button>
      </form>
    </div>
  );
};

export default UpdateMovie;