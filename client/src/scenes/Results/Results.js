import React, { useEffect, useState } from "react";

import axios from "axios";

function Results(state) {
  const [response, setResponse] = useState([]);
  const [results, setResults] = useState([]);

  const [contentOffset, setContentOffset] = useState(0);
  const [noMoreContent, setNoMoreContent] = useState(false);


  useEffect(() => {

    setResponse(state.state.data);

    let tracks = state.state.data;
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
      setContentOffset(contentOffset + 50)
    })
    .catch((error) => {
      console.log(error);
    });
    
  }, []);

  const handleLoadContentButtonCLick = () => {
    try {
      let tracks = response;
      let ids = "";

      for (let i = 0 + contentOffset; i < 50 + contentOffset; i++) {
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
        .then((res) => {
          // creates new track object and adds it to userTopTracks
          let newTracks = res.data.tracks;
          newTracks.forEach((element) => {
            setResults((results) => [...results, element]);
          });
        })
        .catch((error) => {
          console.log(error);
        });

      setContentOffset(contentOffset + 50);
    } catch {
      setNoMoreContent(true);
    }
  };

  const renderResults = () => {
    return (
      <div>
        {results.map((elem) => (
          <div key={elem.id}>
            <a href={elem.uri}>{elem.name}</a>
            <p>{elem.artists[0].name}</p>
            <img src={elem.album.images[2].url} alt="album_cover" />
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </div>
        ))}
      </div>
    );
  };

  const renderLoadContentButton = () => {
    if (noMoreContent) {
      return <p>We're sorry, there are no more recommendations for you.</p>;
    } else {
      return (
        <button onClick={() => handleLoadContentButtonCLick()}>
          Load more content
        </button>
      );
    }
  };

  return (
    <>
      <div>{renderResults()}</div>
      <div>{renderLoadContentButton()}</div>
    </>
  );
}

export default Results;
