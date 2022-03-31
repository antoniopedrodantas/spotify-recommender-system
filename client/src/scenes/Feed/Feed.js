import React, { useEffect, useState } from "react";

import axios from "axios";

function Feed() {
  // user data state variable
  const [userData, setUserData] = useState("");
  const [userTopArtists, setUserTopArtists] = useState("");

  // Spotify API endpoints
  const USER_INFO_ENDPOINT = "https://api.spotify.com/v1/me";
  const USER_PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/top/artists";

  // gets the return token values from the Spotify's API
  const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
      // console.log(currentValue);
      const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    }, {});

    return paramsSplitUp;
  };

  // fetches url tokens on page load
  useEffect(() => {

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
      axios
        .get(USER_INFO_ENDPOINT, {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        })
        .then((response) => {
          setUserData(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });

      // gets user's top artists
      axios
      .get(USER_PLAYLISTS_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
      .then((response) => {
        console.log(response.data)
        setUserTopArtists(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

    }
  }, [userData]);

  return (
    <div>
      <p>You have reached the feed</p>
      <p>{userData}</p>
      <br></br>
      <p>{userTopArtists}</p>
    </div>
  );
}

export default Feed;
