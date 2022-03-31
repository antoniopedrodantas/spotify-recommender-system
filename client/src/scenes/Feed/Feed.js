import React, { useEffect, useState } from "react";

function Feed() {
  // state variables
  const [accessToken, setAccessToken] = useState("");
  const [tokenType, setTokenType] = useState("");
  const [expiresIn, setExpiresIn] = useState("");

  // gets the return token values from the Spotify's API
  const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
      console.log(currentValue);
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

      localStorage.clear();

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("expiresIn", expires_in);

      setAccessToken(access_token);
      setTokenType(token_type);
      setExpiresIn(expires_in);
    }
  }, []);

  return (
    <div>
      <p>You have reached the feed</p>
      <p>accessToken = {accessToken}</p>
      <p>tokenType = {tokenType}</p>
      <p>expiresIn = {expiresIn}</p>
    </div>
  );
}

export default Feed;
