import React, { useEffect, useState } from "react";

import axios from "axios";

function Results() {
  const [response, setResponse] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/")
      .then((response) => {
        // gets audio features from response
        setResponse(response.data);

        let tracks = response.data;
        let ids = "";

        for (let i = 0; i < 50; i++) {
          ids += tracks[i][0] + ",";
        }

        ids = ids.substring(0, ids.length - 1);

        // gets tracks audio features
        axios
          .get(`https://api.spotify.com/v1/tracks?ids=${ids}`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          })
          .then((response) => {
            // creates new track object and adds it to userTopTracks
            setResults(response.data.tracks);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const renderResults = () => {
    return (
      <div>
        {results.map((elem) => (
          <div key={elem.id}>
            <a href={elem.uri}>{elem.name}</a>
            <p>{elem.artists[0].name}</p>
            <img src={elem.album.images[2].url} />
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </div>
        ))}
      </div>
    );
  };

  return <div>{renderResults()}</div>;
}

export default Results;
