from cgi import test
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

from src.reward import Reward
from src.song import Song
from src.methods import update_reward_function, get_policy_limit, get_test_song_scores

app = Flask(__name__)
CORS(app)

# ------------------------------------
# -  INVERSE REINFORCEMENT LEARNING  -
# ------------------------------------

# ---------- REWARD FUNTION ----------

# should have the parameters: 
#   danceability,
#   energy,
#   instrumentalness,
#   liveness,
#   loudness,
#   speechiness,
#   valence

# the reward function will analyse the parameters of every track and output the "perfect" value for every parameter.

# ---------- POLICY ----------

# the policy whether to like it or not is the max difference from the track from the song set.
# meaning that every song that has a difference greater from that one track is not going to be liked
# the slimmer the distance the best the track is

@app.route("/", methods=['POST'])
def recommendation_generator():

    print("server was reached!")

    request_data = request.get_json()

    top_tracks_data = request_data["top_tracks"]
    test_tracks_data = request_data["test_tracks"]

    # creates reward function and updates it according to the user's top tracks
    reward_function_params = Reward()
    reward_function = {"undefined": reward_function_params}
    update_reward_function(reward_function, top_tracks_data)

    # gets the max distance from reward score that tells if a song is going to be liked or not
    policy_limit = get_policy_limit(reward_function, top_tracks_data)

    print("\n")

    print("To calculate the reward value of a song we add the absolute difference value of each of its parameters with the reward function.")

    print("\n")

    print("The policy limit let's us know if a song is considered good or not")
    print("This is the track from the song set that has the highest difference, therefore every new song it is analysed that surpasses this value is considered to be not good.")
    print("The lower the reward value, the more the user is likeky going to like it.")

    test_tracks_results = sorted(get_test_song_scores(reward_function, test_tracks_data, policy_limit))

    # creates response
    response = []
    # datetime object containing current date and time
    now = datetime.now()
    now_string = now.strftime("%d/%m/%Y %H:%M:%S")
    # starts saving info to the db.txt file
    f = open("db.txt", "a")
    f.write(request_data["user"])
    f.write(" on: ")
    f.write(now_string)
    f.write("\n")
    f_counter = 0
    for track in test_tracks_results:
        item = [track.id, track.name, track.artist, track.score, track.genre]
        # it only recommends one track by artist
        can_add = 0
        for track_cmp in response:
            if item[2] == track_cmp[2]:
                can_add = 1
        
        # if the artist is not already in the response, it adds to it
        if can_add == 0:
            response.append(item)
            # fills out db as well
            if f_counter < 25:
                f.write(item[1])
                f.write(" - ")
                f.write(item[2])
                f.write(" [")
                f.write(item[4])
                f.write("]")
                f.write("\n")
            f_counter += 1
    
    # closes file
    f.write("\n")
    f.close()

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)