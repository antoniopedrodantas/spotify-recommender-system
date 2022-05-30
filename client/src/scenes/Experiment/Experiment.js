import React from "react";

// Styling
import "./Experiment.css";

function Experiment() {
  // ============================================== Handlers ==============================================

  // sends request to the server through the click of the button
  const handleLogoutButtonCLick = () => {
    localStorage.clear();
    window.location = "/";
  };

  // sends user to the google form
  const handleFormButtonClick = () => {
    localStorage.clear();
    window.location =
      "https://docs.google.com/forms/d/e/1FAIpQLScse-XYfqQHKtW_WG7HQ2ismS2BESn10PwZjpriZFbktWGz0w/viewform?usp=sf_link";
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

  // ============================================== return ==============================================

  return (
    <div>
      <div className="navbar">
        <div className="text-top">INVERSE REINFORCEMENT LEARNING</div>
        {renderLogoutButton()}
      </div>
      <div className="webpage-conatainer">
        <div className="spotify-images-container">
          <div className="spotify-image-wrapper-left">
            <img
              className="spotify-image"
              src="https://i.imgur.com/EqVMdb2.png"
              alt="spotify dashboard"
            />
          </div>
          <div className="spotify-image-wrapper-right">
            <img
              className="spotify-image"
              src="https://i.imgur.com/iWsh2nf.png"
              alt="spotify playlists"
            />
          </div>
        </div>
        <div className="instructions-div">
          <div className="intro-question">WHAT DO YOU NEED TO DO?</div>
          <div className="instructions-text">
            TWO PLAYLISTS WERE CREATED ON YOUR SPOTIFY ACCOUNT. THE FIRST ONE IS
            CALLED irl_recommendations AND WAS GENERATED USING OUR INVERSE
            REINFORCEMENT LEARNING ALGORITHM. THE OTHER IS CALLED
            spotify_recommendations AND WAS GENERATED USING SPOTIFY'S
            RECOMMENDATION SYSTEM. WE ARE ASKING YOU TO GIVE THEM A LISTEN AND
            THEN ANSWER A QUICK SURVEY ABOUT THEIR DIFFERENCES AND SUCCESS
            REGARDING YOUR MUSIC TASTE. YOU CAN ACCESS THE FORM BY CLICKING ON
            THE LINK BELOW. PLEASE, GIVE HONEST ANSWERS. THANK YOU SO MUCH FOR
            YOUR HELP 🥰
          </div>
        </div>
        <div className="form-button-container">
          <div className="form-button" onClick={() => handleFormButtonClick()}>
            FORM
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experiment;
