from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['POST'])
def recommendation_generator():

    print("server was reached!")

    request_data = request.get_json()

    print(request_data)
    return ""

if __name__ == "__main__":
    app.run()