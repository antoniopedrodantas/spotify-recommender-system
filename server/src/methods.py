from pulp import *

from src.reward import Reward
from src.song import Song

# method gets the sum of all the differences between a reward parameter and the test songs
def get_sum_difference_value(reward_value, test_songs_array):
    sum = 0

    for song in test_songs_array:
        sum += reward_value - song

    return sum

# method creates values for reward function on every parameter
def update_reward_function(reward_function, tracks_data):

    # =============================== using linear programming to minimize the difference between the perfect parameter values with track genres ===============================
    # creates all genres for the reward function
    for track in tracks_data:
        if track["genre"] not in reward_function:
            reward_function[track["genre"]] = Reward()

    # for every genre in the reward function iterates through top tracks and finds out the best values for them
    for genre in reward_function:
        genre_tracks = []
        for track in tracks_data:
            if track["genre"] == genre:
                genre_tracks.append(track)

        danceability_array = []
        energy_array = []
        instrumentalness_array = []
        liveness_array = []
        speechiness_array = []
        valence_array = []

        for track in genre_tracks:
            danceability_array.append(track["danceability"])
            energy_array.append(track["energy"])
            instrumentalness_array.append(track["instrumentalness"])
            liveness_array.append(track["liveness"])
            # loudness_array.append(track["loudness"])
            speechiness_array.append(track["speechiness"])
            valence_array.append(track["valence"])
        
        # elementary features
        lp = LpProblem("Reward_Problem", LpMinimize)

        # defined variables
        danceability = LpVariable(name="danceability", lowBound = 0, cat="Float")
        energy = LpVariable(name="energy", lowBound = 0, cat="Float")
        instrumentalness = LpVariable(name="instrumentalness", lowBound = 0, cat="Float")
        liveness = LpVariable(name="liveness", lowBound = 0, cat="Float")
        speechiness = LpVariable(name="speechiness", lowBound = 0, cat="Float")
        valence = LpVariable(name="valence", lowBound = 0, cat="Float")

        t_danceability = LpVariable(name="abs_helper_d", lowBound = 0, cat="Integer")
        t_energy = LpVariable(name="abs_helper_e", lowBound = 0, cat="Integer")
        t_instrumentalness = LpVariable(name="abs_helper_i", lowBound = 0, cat="Integer")
        t_liveness = LpVariable(name="abs_helper_l", lowBound = 0, cat="Integer")
        t_speechiness = LpVariable(name="abs_helper_s", lowBound = 0, cat="Integer")
        t_valence = LpVariable(name="abs_helper_v", lowBound = 0, cat="Integer")

        # objective function
        lp += t_danceability + t_energy + t_instrumentalness + t_liveness + t_speechiness + t_valence

        # constraints
        lp += t_danceability >= get_sum_difference_value(danceability, danceability_array)
        lp += -t_danceability <= get_sum_difference_value(danceability, danceability_array)

        lp += t_energy >= get_sum_difference_value(energy, energy_array)
        lp += -t_energy <= get_sum_difference_value(energy, energy_array)

        lp += t_instrumentalness >= get_sum_difference_value(instrumentalness, instrumentalness_array)
        lp += -t_instrumentalness <= get_sum_difference_value(instrumentalness, instrumentalness_array)

        lp += t_liveness >= get_sum_difference_value(liveness, liveness_array)
        lp += -t_liveness <= get_sum_difference_value(liveness, liveness_array)

        lp += t_speechiness >= get_sum_difference_value(speechiness, speechiness_array)
        lp += -t_speechiness <= get_sum_difference_value(speechiness, speechiness_array)

        lp += t_valence >= get_sum_difference_value(valence, valence_array)
        lp += -t_valence <= get_sum_difference_value(valence, valence_array)

        # solving the lp
        status = lp.solve()
        print("Status: ", status)

        for var in lp.variables():
            print(var, " = ", value(var))
        print("OPT = ", value(lp.objective))

        # gives lp solution variables to the reward function
        reward_function[genre].danceability = value(danceability)
        reward_function[genre].energy = value(energy)
        reward_function[genre].instrumentalness = value(instrumentalness)
        reward_function[genre].liveness = value(liveness)
        reward_function[genre].speechiness = value(speechiness)
        reward_function[genre].valence = value(valence)

        



# method gets the max value a track can get from as a reward
# that serves as a limit to see if it is going to be liked or not
def get_policy_limit(reward_function, tracks_data):
    # # =============================== implementation for first reward function with genres ===============================
    policy_limit = {"undefined": 0}

    for genre in reward_function:
        policy_limit[genre] = 0
        for track in tracks_data:
            policy_tmp = 0
            if genre == track["genre"]:
                policy_tmp += abs(reward_function[genre].danceability - track["danceability"])
                policy_tmp += abs(reward_function[genre].energy - track["energy"])
                policy_tmp += abs(reward_function[genre].instrumentalness - track["instrumentalness"])
                policy_tmp += abs(reward_function[genre].liveness - track["liveness"])
                policy_tmp += abs(reward_function[genre].speechiness - track["speechiness"])
                policy_tmp += abs(reward_function[genre].valence - track["valence"])
            if policy_tmp > policy_limit[genre]:
                policy_limit[genre] = policy_tmp
    
    return policy_limit




def get_test_song_scores(reward_function, tracks_data, policy_limit):

    # # =============================== implementation for first reward function with genres ===============================
    song_results = []

    for genre in reward_function:
        for track in tracks_data:
            track_score = 0

            if genre == track["genre"]:

                track_score += abs(reward_function[genre].danceability - track["danceability"])
                track_score += abs(reward_function[genre].energy - track["energy"])
                track_score += abs(reward_function[genre].instrumentalness - track["instrumentalness"])
                track_score += abs(reward_function[genre].liveness - track["liveness"])
                track_score += abs(reward_function[genre].speechiness - track["speechiness"])
                track_score += abs(reward_function[genre].valence - track["valence"])
            
            if track_score < policy_limit[genre]:
                song_results.append(Song(track["id"], track["name"], track_score))

    return song_results
