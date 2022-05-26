import React, { useEffect, useState } from "react";

import axios from "axios";

// Styling
import "./Results.css";

function Results(props) {
  const [response, setResponse] = useState([]);
  const [results, setResults] = useState([]);

  const [contentOffset, setContentOffset] = useState(0);
  const [noMoreContent, setNoMoreContent] = useState(false);

  // ============================================== useEffect ==============================================

  useEffect(() => {
    setResponse(props.state.data);

    let tracks = props.state.data;
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
        setContentOffset(contentOffset + 50);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // ============================================== Handlers ==============================================

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
            if (element.album.images.length > 0) {
              setResults((results) => [...results, element]);
            }
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

  // ============================================== Renders ==============================================

  const renderResults = () => {
    return (
      <>
        {results.map((elem) => (
          <div className="result-wrapper" key={elem.id}>
            <div className="result-cover">
              <img className="album-pic" src={elem.album.images[2].url} alt="album_cover" />
            </div>
            <div className="result-song-artist">
              <div className="result-text">
                <a className="result-song" href={elem.uri}>{elem.name}</a>
              </div>
              <div className="result-text">
                <p className="result-artist">{elem.artists[0].name}</p>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  const renderLoadContentButton = () => {
    if (noMoreContent) {
      return <p>We're sorry, there are no more recommendations for you.</p>;
    } else {
      return (
        <div className="more-content-button" onClick={() => handleLoadContentButtonCLick()}>
          LOAD MORE CONTENT
        </div>
      );
    }
  };

  // ============================================== return ==============================================

  return (
    <>
      {renderResults()}
      <div>{renderLoadContentButton()}</div>
    </>
  );
}

export default Results;
