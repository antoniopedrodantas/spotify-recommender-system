import React, { useEffect, useState } from "react";

import axios from "axios";

import Results from "../Results/Results";

function Feed() {
  // user data state variable
  const [userData, setUserData] = useState({});
  const [userTopArtists, setUserTopArtists] = useState([]);
  const [userTopTracks, setUserTopTracks] = useState([]);
  const [userTestTracks, setUserTestTracks] = useState([]);

  const [userRecommendations, setUserRecommendations] = useState({});
  const [resultsFlag, setResultsFlag] = useState(false);
  const [recommendationButtonFlag, setRecommendationButtonFlag] =
    useState(false);

  // Spotify API endpoints
  const USER_INFO_ENDPOINT = "https://api.spotify.com/v1/me";
  const USER_ARTISTS_ENDPOINT =
    "https://api.spotify.com/v1/me/top/artists?limit=20";
  const USER_TRACKS_ENDPOINT =
    "https://api.spotify.com/v1/me/top/tracks?limit=50";
  // let USER_SEARCH_ENDPOINT =
  //   "https://api.spotify.com/v1/search?q=genre:rock+tag:hipster&type=track&limit=50";

  // gets the return token values from the Spotify's API
  const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
      const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    }, {});

    return paramsSplitUp;
  };

  // creates userTopTracks and userTestTracks array to later send them to the python server
  async function createUserTracks(tracks, access_token, type) {
    let ids = "";

    tracks.forEach((element) => {
      // gets its name and id
      ids += element.id + ",";
    });

    ids = ids.substring(0, ids.length - 1);
    let audio_features;

    // gets tracks audio features
    await axios
      .get(`https://api.spotify.com/v1/audio-features?ids=${ids}`, {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
      .then((response) => {
        // gets audio features from response
        audio_features = response.data.audio_features;

        // creates new track object and adds it to userTopTracks
        for (let i = 0; i < tracks.length; i++) {
          const track = {
            id: tracks[i].id,
            name: tracks[i].name,
            danceability: audio_features[i].danceability,
            duration_ms: audio_features[i].duration_ms,
            energy: audio_features[i].energy,
            instrumentalness: audio_features[i].instrumentalness,
            liveness: audio_features[i].liveness,
            loudness: audio_features[i].loudness,
            speechiness: audio_features[i].speechiness,
            tempo: audio_features[i].tempo,
            time_signature: audio_features[i].time_signature,
            valence: audio_features[i].valence,
          };

          if (type === "top") {
            setUserTopTracks((userTopTracks) => [...userTopTracks, track]);
          } else if (type === "test") {
            setUserTestTracks((userTestTracks) => [...userTestTracks, track]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // sends request to the server through the click of the button
  const handleRecommendationsButtonCLick = () => {
    // sends information to the server
    axios
      .post("http://127.0.0.1:5000/", {
        top_tracks: userTopTracks,
        test_tracks: userTestTracks,
      })
      .then((response) => {
        setUserRecommendations(response);
        setResultsFlag(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // sends request to the server through the click of the button
  const handleLogoutButtonCLick = () => {
    localStorage.clear();
    window.location = "/";
  };

  // fetches url tokens on page load
  useEffect(() => {
    (async () => {
      if (window.location.hash) {
        const { access_token, expires_in, token_type } =
          getReturnedParamsFromSpotifyAuth(window.location.hash);

        // clears localStorage
        localStorage.clear();

        // saves access token and other relevant information in localStorage
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("tokenType", token_type);
        localStorage.setItem("expiresIn", expires_in);

        // gets user's info
        await axios
          .get(USER_INFO_ENDPOINT, {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          })
          .then((response) => {
            setUserData(response.data);
            console.log("Got user data!");
          })
          .catch((error) => {
            console.log(error);
          });

        // list of genres the user is into
        let genres = [];

        // gets user's top artists
        await axios
          .get(USER_ARTISTS_ENDPOINT, {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          })
          .then((response) => {
            const artists = response.data.items;

            if(artists.length > 0){
              setRecommendationButtonFlag(true);
            }

            artists.forEach((element) => {
              const artist = {
                id: element.id,
                name: element.name,
                genres: element.genres,
                popularity: element.popularity,
              };
              setUserTopArtists((userTopArtists) => [
                ...userTopArtists,
                artist,
              ]);

              // adds to genres array the genre of each artist he is into
              if (element.genres[0] !== undefined) {
                const newGenre = element.genres[0].replaceAll(" ", "_");
                if (!genres.includes(newGenre)) {
                  genres.push(newGenre);
                }
              }
            });
            console.log("Got top artists data!");
          })
          .catch((error) => {
            console.log(error);
          });

        // gets user's top tracks
        await axios
          .get(USER_TRACKS_ENDPOINT, {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          })
          .then((response) => {
            createUserTracks(response.data.items, access_token, "top");
            console.log("Got top tracks data!");
          })
          .catch((error) => {
            console.log(error);
          });

        genres.forEach((genre) => {
          const USER_SEARCH_ENDPOINT = `https://api.spotify.com/v1/search?q=genre:${genre}+tag:hipster&type=track&limit=50`;

          // gets user's list of tracks it might like
          axios
            .get(USER_SEARCH_ENDPOINT, {
              headers: {
                Authorization: "Bearer " + access_token,
              },
            })
            .then((response) => {
              createUserTracks(
                response.data.tracks.items,
                access_token,
                "test"
              );
              console.log("Got test tracks data from the ", genre, "genre!");
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    })();
  }, []);

  const renderLogoutButton = () => {
    return <button onClick={() => handleLogoutButtonCLick()}>Logout</button>;
  };

  // renders recommendation button after all useStates are filled up
  const renderRecommendationsButton = () => {
    if (
      userTopTracks.length >= 0 &&
      userTestTracks.length >= 0 &&
      resultsFlag === false &&
      recommendationButtonFlag === true
    ) {
      return (
        <div>
          <p>
            Do you want to get new song recommendations based on an IRL
            approach? Click below.
          </p>
          <button onClick={() => handleRecommendationsButtonCLick()}>
            Get recommendations
          </button>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const renderTopArtists = () => {
    if (!recommendationButtonFlag) {
      return (
        <p>
          We're sorry. There isn't enough information to create recommendtions
          for you. You need to listen to some more music.
        </p>
      );
    } else {
      let artists = "";
      userTopArtists.forEach((artist) => {
        artists = artists + ", " + artist.name;
      });
      artists = artists + ".";
      return (
        <div>
          <p>We can already see you're a big fan of:</p>
          <p>{artists}</p>
        </div>
      );
    }
  };

  const renderRecommendationsResults = () => {
    if (resultsFlag) {
      return (
        <div>
          <Results state={userRecommendations} />
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <div>
      {renderLogoutButton()}
      <p>
        Hello, {userData.display_name}. Welcome to our Spotify recommendation
        system.
      </p>
      <br></br>
      {renderTopArtists()}
      <br></br>
      {renderRecommendationsButton()}
      {renderRecommendationsResults()}
    </div>
  );
}

export default Feed;
