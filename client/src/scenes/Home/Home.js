// Styling
import "./Home.css";

// Icons
import { SiSpotify, SiGithub, SiLinkedin } from "react-icons/si";

// to use environment variables
// process.env.REACT_APP_...

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // insert your client id here from spotify
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/feed";
const SPACE_DELIMITER = "%20";
const SCOPES = [
  "playlist-read-private",
  "user-top-read",
  "user-library-read",
  "user-follow-read",
  "playlist-modify-private",
  "playlist-modify-public",
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const handleLoginButtonCLick = () => {
  window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
};

function Home() {
  return (
    <div>
      <div className="welcome-container">
        <div className="welcome-grid">
          <div className="text-big">
            <h1>INVERSE REINFORCEMENT LEARNING RECOMMENDER SYSTEM</h1>
          </div>
          <div className="icon-container">
            <SiSpotify className="icon-element" size={180} />
          </div>
          <div className="text-small">
            AS PART OF THE INVESTIGATION OF A COMPUTER SCIENE MASTER THESIS AT
            THE UNIVERSITY OF PORTO, THIS PLATFORM WAS BUILT TO EVALUATE THE
            PERFORMANCE OF AN INVERSE REIFORCEMENT LEARNING APPROACH FOR
            INFERRING USER PREFERENCES. IT USES THIS BRANCH OF MACHINE LEARNING
            IN CONJUNCTION WITH THE SPOTIFY API TO GENERATE MUSIC
            RECOMMENDATIONS.
          </div>
        </div>
      </div>
      <div className="button-wrapper">
        <div className="login-button" onClick={() => handleLoginButtonCLick()}>
          LOGIN WITH SPOTIFY
        </div>
      </div>
      <div className="footer-container">
        <div>
          Project developed by António Pedro Dantas, Computer Science @ FEUP
        </div>
        <div className="icon-links-grid">
          <a href="https://github.com/antoniopedrodantas">
            <SiGithub className="icon-link" size={18} />
          </a>
          <a href="https://linkedin.com/in/antoniopedrodantas">
            <SiLinkedin className="icon-link" size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
