import React from "react";

import axios from "axios";

function CreatePlaylistButton(props) {
  // ============================================== Handlers ==============================================

  async function handleCreatePlaylistButtonCLick() {
    // creates playlist
    axios
      .post(
        `https://api.spotify.com/v1/users/${props.state.id}/playlists`,
        {
          name: `${props.state.display_name}_recommendations_irl`,
          public: false,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        console.log(response);

        let tracks = props.songs.data;
        let ids = [];

        for (let i = 0; i < 100; i++) {
          //   ids += "spotify:track:" + tracks[i][0] + ",";
          ids.push("spotify:track:" + tracks[i][0]);
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
          .then((response2) => {
            console.log(response2);
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
        <button onClick={() => handleCreatePlaylistButtonCLick()}>
          Create Playlist
        </button>
      </div>
    </>
  );
}

export default CreatePlaylistButton;
