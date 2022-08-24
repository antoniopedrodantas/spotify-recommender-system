# spotify-recommender-system

Spotify Recommender System was the final project for my master's dissertation. It consists in a platform that uses Inverse Reinforcement Learning to analyse and infer user preferences on a streaming platform, in this case, Spotify. It later recommends new content to users according to their musical taste. It holds a client-side in charge of communicating with the Spotify's API using React and a sever-side application built on Python that treats the acquired information.

![spotify recommender system login](https://i.imgur.com/L4sIl4x.png)

## Instructions

### Setup

Access Spotify for Developers and create a new app. That should give you a Client ID and a Client Secret.

Inside the ```client/``` directory, create a .env file and add those two tokens accordingly:
- ```REACT_APP_CLIENT_ID = ...```
- ```REACT_APP_CLIENT_SECRET = ...```

### Run it

Create 2 terminal instances. 

On the first one:
1. Change to the server directory: ```cd server/```
2. Install the dependencies:
    - ```pip install Flask```
    - ```pip install flask-cors```
    - ```pip install pulp```
3. ```python3 server.py```

On the second:
1. Change to the client directory: ```cd client/```
2. Install the dependecies: ```npm install```
3. Start the app: ```npm start```

To test the application you only need to use the __client__ app, by accessing http://localhost:3000/.
