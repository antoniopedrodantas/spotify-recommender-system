import React, { useEffect, useState } from "react";

import axios from "axios";

function Feed() {
  // user data state variable
  const [userData, setUserData] = useState("");
  const [userTopArtists, setUserTopArtists] = useState([]);
  const [userTopTracks, setUserTopTracks] = useState([]);

  // Spotify API endpoints
  const USER_INFO_ENDPOINT = "https://api.spotify.com/v1/me";
  const USER_ARTISTS_ENDPOINT =
    "https://api.spotify.com/v1/me/top/artists?limit=50";
  const USER_TRACKS_ENDPOINT =
    "https://api.spotify.com/v1/me/top/tracks?limit=50";

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

  // creates userTopTracks array to later send them to the python server
  async function createUserTopArtists(artists) {
    artists.forEach((element) => {
      const artist = {
        id: element.id,
        name: element.name,
        genres: element.genres,
        popularity: element.popularity,
      };
      setUserTopArtists((userTopArtists) => [...userTopArtists, artist]);
    });
  }

  // creates userTopTracks array to later send them to the python server
  async function createUserTopTracks(tracks, access_token) {
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

          setUserTopTracks((userTopTracks) => [...userTopTracks, track]);
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
        artists: userTopArtists,
        tracks: userTopTracks,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
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
            setUserData(JSON.stringify(response.data));
            console.log("Got user data!");
          })
          .catch((error) => {
            console.log(error);
          });

        // gets user's top artists
        await axios
          .get(USER_ARTISTS_ENDPOINT, {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          })
          .then((response) => {
            createUserTopArtists(response.data.items);
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
            createUserTopTracks(response.data.items, access_token);
            console.log("Got top tracks data!");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })();
  }, []);

  return (
    <div>
      <p>You have reached the feed</p>
      <p>{userData}</p>
      <br></br>
      <button onClick={() => handleRecommendationsButtonCLick()}>
        Get recommendations
      </button>
    </div>
  );
}

export default Feed;
