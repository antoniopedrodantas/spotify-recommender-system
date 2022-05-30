import React from "react";

import axios from "axios";

// Styling
import "./CreatePlaylistButton.css"

function CreatePlaylistButton(props) {
  // ============================================== Handlers ==============================================

  async function handleCreatePlaylistButtonCLick() {
    // creates playlist's name based on the type of recommendations
    const playlistName = `${props.state}_recommendations`
    // creates playlist
    axios
      .post(
        `https://api.spotify.com/v1/users/${props.user.id}/playlists`,
        {
          name: playlistName,
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
        let tracks = props.songs.data;
        let ids = [];

        for (let i = 0; i < 100; i++) {
          // checks that it is not undefined
          if(tracks[i]){
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
            console.log(`${playlistName} created succesfully!`);
          })
          .catch((error2) => {
            console.log(error2);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // ============================================== return ==============================================

  return (
    <>
      <div>
        <div className="create-playlist-button"onClick={() => handleCreatePlaylistButtonCLick()}>
          CREATE PLAYLIST
        </div>
      </div>
    </>
  );
}

export default CreatePlaylistButton;
