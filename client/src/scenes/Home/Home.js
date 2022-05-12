

// to use environment variables
// process.env.REACT_APP_...

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;; // insert your client id here from spotify
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/feed";
const SPACE_DELIMITER = "%20";
const SCOPES = [
  "playlist-read-private",
  "user-top-read",
  "user-library-read",
  "user-follow-read",
  "playlist-modify-private",
  "playlist-modify-public"
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const handleLoginButtonCLick = () => {
  window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`
};

function Home() {
  return (
    <div>
      <button onClick={() => handleLoginButtonCLick()}>
        Login with Spotify
      </button>
    </div>
  );
}

export default Home;