from src.reward import Reward
from src.song import Song

# method creates values for reward function on every parameter
def update_reward_function(reward_function, tracks_data):
    
    counter = 0

    for track in tracks_data:
        counter += 1
        
        reward_function.danceability += track["danceability"]
        reward_function.energy += track["energy"]
        reward_function.instrumentalness += track["instrumentalness"]
        reward_function.liveness += track["liveness"]
        reward_function.loudness += track["loudness"]
        reward_function.speechiness += track["speechiness"]
        reward_function.valence += track["valence"]
    
    reward_function.danceability = reward_function.danceability / counter
    reward_function.energy = reward_function.energy / counter
    reward_function.instrumentalness = reward_function.instrumentalness / counter
    reward_function.liveness = reward_function.liveness / counter
    reward_function.loudness = reward_function.loudness / counter
    reward_function.speechiness = reward_function.speechiness / counter
    reward_function.valence = reward_function.valence / counter

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
        policy_tmp += abs(reward_function.loudness - track["loudness"])
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
        track_score += abs(reward_function.loudness - track["loudness"])
        track_score += abs(reward_function.speechiness - track["speechiness"])
        track_score += abs(reward_function.valence - track["valence"])

        if track_score < policy_limit:
            song_results.append(Song(track["id"], track["name"], track_score))

    return song_results










