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
    
    # # =============================== uses mean value for all parameters ===============================
    # counter = 0

    # for track in tracks_data:
    #     counter += 1
        
    #     reward_function.danceability += track["danceability"]
    #     reward_function.energy += track["energy"]
    #     reward_function.instrumentalness += track["instrumentalness"]
    #     reward_function.liveness += track["liveness"]
    #     reward_function.loudness += track["loudness"]
    #     reward_function.speechiness += track["speechiness"]
    #     reward_function.valence += track["valence"]
    
    # reward_function.danceability = reward_function.danceability / counter
    # reward_function.energy = reward_function.energy / counter
    # reward_function.instrumentalness = reward_function.instrumentalness / counter
    # reward_function.liveness = reward_function.liveness / counter
    # reward_function.loudness = reward_function.loudness / counter
    # reward_function.speechiness = reward_function.speechiness / counter
    # reward_function.valence = reward_function.valence / counter

    # =============================== using linear programming to minimize the difference between the perfect parameter values ===============================
    danceability_array = []
    energy_array = []
    instrumentalness_array = []
    liveness_array = []
    speechiness_array = []
    valence_array = []

    for track in tracks_data:
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
    reward_function.danceability = value(danceability)
    reward_function.energy = value(energy)
    reward_function.instrumentalness = value(instrumentalness)
    reward_function.liveness = value(liveness)
    reward_function.speechiness = value(speechiness)
    reward_function.valence = value(valence)


# method gets the max value a track can get from as a reward
# that serves as a limit to see if it is going to be liked or not
def get_policy_limit(reward_function, tracks_data):

    policy_limit = 0

    for track in tracks_data:
        policy_tmp = 0

        policy_tmp += abs(reward_function.danceability - track["danceability"])
        policy_tmp += abs(reward_function.energy - track["energy"])
        policy_tmp += abs(reward_function.instrumentalness - track["instrumentalness"])
        policy_tmp += abs(reward_function.liveness - track["liveness"])
        policy_tmp += abs(reward_function.speechiness - track["speechiness"])
        policy_tmp += abs(reward_function.valence - track["valence"])

        if policy_tmp > policy_limit:
            policy_limit = policy_tmp
        
    return policy_limit

def get_test_song_scores(reward_function, tracks_data, policy_limit):

    song_results = []

    for track in tracks_data:
        track_score = 0

        track_score += abs(reward_function.danceability - track["danceability"])
        track_score += abs(reward_function.energy - track["energy"])
        track_score += abs(reward_function.instrumentalness - track["instrumentalness"])
        track_score += abs(reward_function.liveness - track["liveness"])
        track_score += abs(reward_function.speechiness - track["speechiness"])
        track_score += abs(reward_function.valence - track["valence"])

        if track_score < policy_limit:
            song_results.append(Song(track["id"], track["name"], track_score))

    return song_results










