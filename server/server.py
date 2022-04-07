from flask import Flask, request
from flask_cors import CORS

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
    reward_function = Reward()
    update_reward_function(reward_function, top_tracks_data)

    # gets the max distance from reward score that tells if a song is going to be liked or not
    policy_limit = get_policy_limit(reward_function, top_tracks_data)

    print("Here are the perfect song parameter values as the reward function:")
    print(" danceability: ", reward_function.danceability)
    print(" energy: ", reward_function.energy)
    print(" instrumentalness: ", reward_function.instrumentalness)
    print(" liveness: ", reward_function.liveness)
    # print(" loudness: ", reward_function.loudness)
    print(" speechiness: ", reward_function.speechiness)
    print(" valence: ", reward_function.valence)

    print("\n")

    print("To calculate the reward value of a song we add the absolute difference value of each of its parameters with the reward function.")

    print("\n")

    print("The policy limit to which a song is considered good or not: ", policy_limit)
    print("This is the track from the song set that has the highest difference, therefore every new song it is analysed that surpasses this value is considered to be not good.")
    print("The lower the reward value, the more the user is likeky going to like it.")

    test_tracks_results = sorted(get_test_song_scores(reward_function, test_tracks_data, policy_limit))

    print(test_tracks_results)


    return ""

if __name__ == "__main__":
    app.run(debug=True)