from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['POST'])
def recommendation_generator():

    print("server was reached!")

    request_data = request.get_json()

    artists_data = request_data["artists"]
    tracks_data = request_data["tracks"]

    artists = []
    tracks = []

    for artist in artists_data:
        artists.append(artist["name"])

    for track in tracks_data:
        tracks.append(track["name"])

    print(artists)
    print(tracks)

    return ""

if __name__ == "__main__":
    app.run(debug=True)