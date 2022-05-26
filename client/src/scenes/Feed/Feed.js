import React, { useEffect, useState } from "react";

import axios from "axios";

import "./Feed.css";

import Results from "../../components/Results/Results";
import CreatePlaylistButton from "../../components/CreatePlaylistButton/CreatePlaylistButton";

// Styling
import "./Feed.css";

function Feed() {
  // user data state variable
  const [userData, setUserData] = useState({});
  const [userTopArtists, setUserTopArtists] = useState([]);
  const [userTopTracks, setUserTopTracks] = useState([]);
  const [userTestTracks, setUserTestTracks] = useState([]);

  // holds values of server side response
  const [userRecommendations, setUserRecommendations] = useState({});
  const [resultsFlag, setResultsFlag] = useState(false);

  // flag tell if its ok to show the spotify results
  const [userSpotifyRecommendations, setUserSpotifyRecommendations] = useState(
    []
  );
  const [spotifyResultsFlag, setSpotifyResultsFlag] = useState(false);

  // flags tell if its ok to show the results component and the "Get Recommendations" button
  const [recommendationButtonFlag, setRecommendationButtonFlag] =
    useState(false);

  // Spotify API endpoints
  const USER_INFO_ENDPOINT = "https://api.spotify.com/v1/me";
  const USER_ARTISTS_ENDPOINT =
    "https://api.spotify.com/v1/me/top/artists?limit=20";
  const USER_TRACKS_ENDPOINT =
    "https://api.spotify.com/v1/me/top/tracks?limit=50";

  // ============================================== Methods ==============================================

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
  async function createUserTracks(tracks, access_token, type, genre) {
    // creates ids string for axios request
    let ids = "";

    tracks.forEach((element) => {
      // gets its name and id
      ids += element.id + ",";
    });

    ids = ids.substring(0, ids.length - 1);

    // gets tracks audio features
    await axios
      .get(`https://api.spotify.com/v1/audio-features?ids=${ids}`, {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
      .then((response) => {
        // gets audio features from response
        const audio_features = response.data.audio_features;

        // creates new track object and adds it to userTopTracks
        for (let i = 0; i < tracks.length; i++) {
          let trackGenre = genre;

          // if the genre is "" then it is a top track and we need to find out what its genre is
          // if it is a test track it already comes in the function call
          if (trackGenre === "" && type === "top") {
            axios
              .get(
                `https://api.spotify.com/v1/artists?ids=${tracks[i].artists[0].id}`,
                {
                  headers: {
                    Authorization: "Bearer " + access_token,
                  },
                }
              )
              .then((response2) => {
                // gets trackGenre
                trackGenre = response2.data.artists[0].genres[0];

                if (!trackGenre) {
                  trackGenre = "undefined";
                }

                // creates track object that adds to the state variable
                const track = {
                  id: tracks[i].id,
                  name: tracks[i].name,
                  artist: tracks[i].artists[0].name,
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
                  genre: trackGenre,
                };

                setUserTopTracks((userTopTracks) => [...userTopTracks, track]);
              })
              .catch((error) => {
                console.log(error);
              });
          }
          if (trackGenre !== "" && type === "test") {
            // creates track object that adds to the state variable
            const track = {
              id: tracks[i].id,
              name: tracks[i].name,
              artist: tracks[i].artists[0].name,
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
              genre: trackGenre,
            };
            setUserTestTracks((userTestTracks) => [...userTestTracks, track]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // ============================================== useEffect ==============================================

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

        // clears useStates
        setUserData({});
        setUserTopArtists([]);
        setUserTopTracks([]);
        setUserTestTracks([]);
        setUserSpotifyRecommendations([]);

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

            if (artists.length > 0) {
              setRecommendationButtonFlag(true);
            }

            artists.forEach((element) => {
              const artist = {
                id: element.id,
                name: element.name,
                genres: element.genres,
                popularity: element.popularity,
                image: element.images[0],
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
            createUserTracks(response.data.items, access_token, "top", "");

            // get spotify recommendations
            let spotifyRecommendations = [];
            response.data.items.forEach((track) => {
              axios
                .get(
                  `https://api.spotify.com/v1/recommendations?seed_tracks=${track.id}`,
                  {
                    headers: {
                      Authorization:
                        "Bearer " + localStorage.getItem("accessToken"),
                    },
                  }
                )
                .then((response) => {
                  const results = response.data.tracks;

                  // gets the first two song recommendations for every track in userTopTracks
                  if (results[0]) {
                    const first_song = [
                      results[0].id,
                      results[0].name,
                      results[0].artists[0].name,
                      0,
                    ];
                    spotifyRecommendations.push(first_song);
                  }

                  if (results[1]) {
                    const second_song = [
                      results[1].id,
                      results[1].name,
                      results[1].artists[0].name,
                      0,
                    ];
                    spotifyRecommendations.push(second_song);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            });
            setUserSpotifyRecommendations(spotifyRecommendations);
          })
          .catch((error) => {
            console.log(error);
          });

        // iterates through the genre array
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
                "test",
                genre
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

  // ============================================== Handlers ==============================================

  // sends request to the server through the click of the button
  const handleLogoutButtonCLick = () => {
    localStorage.clear();
    window.location = "/";
  };

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

  const handleSpotifyRecommendationsButtonCLick = () => {
    if (userSpotifyRecommendations.length >= 0) {
      setSpotifyResultsFlag(true);
    }
  };

  const handleExperimentsButton = () => {
    // creates irl_recommenndations playlist
    axios
      .post(
        `https://api.spotify.com/v1/users/${userData.id}/playlists`,
        {
          name: "irl_recommendations",
          public: false,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        // starts filling up the playlist with the recommended songs
        let tracks = userRecommendations.data;
        let ids = [];

        for (let i = 0; i < 25; i++) {
          // checks that it is not undefined
          if (tracks[i]) {
            ids.push("spotify:track:" + tracks[i][0]);
          }
        }

        // adds songs to the playlist
        axios
          .post(
            `https://api.spotify.com/v1/playlists/${response.data.id}/tracks`,
            {
              uris: ids,
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
            }
          )
          .then(() => {
            console.log(`irl_recommendations playlist created succesfully!`);
          })
          .catch((error2) => {
            console.log(error2);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    // creates spotify recommendations playlist
    const info = {
      data: userSpotifyRecommendations,
    };
    axios
      .post(
        `https://api.spotify.com/v1/users/${userData.id}/playlists`,
        {
          name: "spotify_recommendations",
          public: false,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        // starts filling up the playlist with the recommended songs
        let tracks = info.data;
        let ids = [];

        for (let i = 0; i < 25; i++) {
          // checks that it is not undefined
          if (tracks[i]) {
            ids.push("spotify:track:" + tracks[i][0]);
          }
        }

        // adds songs to the playlist
        axios
          .post(
            `https://api.spotify.com/v1/playlists/${response.data.id}/tracks`,
            {
              uris: ids,
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
            }
          )
          .then(() => {
            console.log(
              `spotify_recommendations playlist created succesfully!`
            );
          })
          .catch((error2) => {
            console.log(error2);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ============================================== Renders ==============================================

  const renderLogoutButton = () => {
    return (
      <div className="logout-button-container">
        <button
          className="logout-button"
          onClick={() => handleLogoutButtonCLick()}
        >
          LOGOUT
        </button>
      </div>
    );
  };

  const renderUserCard = () => {
    if (!userData.images) {
      return <></>;
    } else {
      return (
        <div className="user-card-container">
          <div className="user-picture">
            <img
              alt="profile picture"
              className="profile-pic"
              src={userData.images[0].url}
            />
          </div>
          <div className="display-name">{userData.id}</div>
          <div>{userData.followers.total} followers</div>
        </div>
      );
    }
  };

  // const renderTopArtists = () => {
  //   if (!recommendationButtonFlag) {
  //     return (
  //       <p>
  //         We're sorry. There isn't enough information to create recommendtions
  //         for you. You need to listen to some more music.
  //       </p>
  //     );
  //   } else {
  //     return <ArtistsComponent artists={userTopArtists} />;
  //   }
  // };

  // renders recommendation button after all useStates are filled up
  const renderRecommendationsButton = () => {
    if (
      userTopTracks.length >= 0 &&
      userTestTracks.length >= 0 &&
      resultsFlag === false &&
      recommendationButtonFlag === true
    ) {
      return (
        <div className="recommendations-wrapper webpage-item">
          <div
            className="recommendations-button"
            onClick={() => handleRecommendationsButtonCLick()}
          >
            GET RECOMMENDATIONS
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const renderRecommendationsResults = () => {
    if (resultsFlag) {
      return (
        <div className="recommendations-wrapper webpage-item recommendations-container">
          <div className="create-playlist-wrapper">
            <CreatePlaylistButton
              state="irl"
              user={userData}
              songs={userRecommendations}
            />
          </div>
          <Results state={userRecommendations} />
        </div>
      );
    } else {
      return <></>;
    }
  };

  const renderSpotifyRecommendationsButton = () => {
    if (
      userTopTracks.length >= 0 &&
      userTestTracks.length >= 0 &&
      spotifyResultsFlag === false &&
      recommendationButtonFlag === true
    ) {
      return (
        <div>
          <p>
            Do you want to get new song recommendations based on an already
            existing Spotify algorithm? Click below.
          </p>
          <button onClick={() => handleSpotifyRecommendationsButtonCLick()}>
            Get recommendations
          </button>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const renderSpotifyRecommendationsResults = () => {
    if (spotifyResultsFlag) {
      const info = {
        data: userSpotifyRecommendations,
      };
      return (
        <div>
          <div>
            <CreatePlaylistButton
              state="spotify"
              user={userData}
              songs={info}
            />
          </div>
          <div>
            <Results state={info} />
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const renderExperimentsDiv = () => {
    if (resultsFlag) {
      return (
        <div
          className="experiments-div"
          onClick={() => handleExperimentsButton()}
        >
          <div className="text-link">
            WANT TO HELP US ENHANCE OUR ALGORITHM?
          </div>
          <div className="text-miniscule">
            THIS IMPLIES LISTENING TO TWO DIFFERENT SUGGESTION PLAYLISTS AND
            ANSWERING A SMALL SURVEY
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  // ============================================== return ==============================================

  return (
    // Add webpage that says there isn't enough information to create recommendations
    <div>
      <div className="navbar">
        <div className="text-top">INVERSE REINFORCEMENT LEARNING</div>
        {renderLogoutButton()}
      </div>
      <div className="webpage-container">
        <div className="instruction-text webpage-item">
          WELCOME, {userData.display_name}. THE INVERSE REINFORCEMENT LEARNING
          RECOMMENDER SYSTEM ALLOWS YOU TO GENERATE MUSIC RECOMMENDATIONS THAT
          WERE ATTRIBUTED TO YOU. IT USES IRL TO TEST ITS SUCCESS ON INFERRING
          USER PREFERENCES. YOU CAN CHECK OUT YOUR RECOMMENDATIONS RIGHT HERE OR
          IMPORT THEM TO A PLAYLIST ON YOUR SPOTIFY ACCOUNT.
        </div>
        {renderRecommendationsButton()}
        {renderRecommendationsResults()}
        {renderExperimentsDiv()}
      </div>
    </div>
  );
}

export default Feed;
