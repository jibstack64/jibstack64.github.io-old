# import required libraries
import atexit
import signal
import random
import string
import flask
import json

# static variables
NAME = "SUGGESTIONS-SERVER"
HOST, PORT = "localhost", 5152
VOTES = "./votes.json"
DEBUG = False

# generates random strings
def rand(n: int = 5) -> str:
    return "".join([random.choice(string.ascii_letters) for x in range(n)])

# initialise and load all
app = flask.Flask(NAME)
votes: list[dict[str, str]] = json.load(open(VOTES, "r"))

# on exit, write suggestions
write_out = lambda : json.dump(votes, open(VOTES, "w"), indent=4)
atexit.register(write_out)
signal.signal(signal.SIGTERM, write_out)

@app.route("/suggestions", methods=["POST", "GET"])
def suggestions():
    request = flask.request
    # add to
    if request.method == "POST":
        try:
            js: dict[str, str] = json.loads(request.data)
        except:
            return flask.make_response(("Invalid/no JSON.", 400))
        if js.get("content") == None:
            return flask.make_response(("Invalid JSON: no suggestion content.", 400))
        else:
            count = 0
            for vote in votes:
                if vote.get("from") == request.remote_addr and not DEBUG:
                    count += 1
            if count > 2:
                return flask.make_response(("You can only post 3 suggestions until the next suggestion-cycle.", 400))
            votes.append({
                "id": rand(),
                "from": request.remote_addr,
                "suggestion": js.get("content"),
                "votes": 0
            })
            return flask.make_response(("Successfully added suggestion.", 201))
    # fetch all
    else:
        clean = []
        for x in votes.copy():
            a = x.copy()
            try:
                a.pop("from")
            except:
                continue # malformed, ignore
            clean.append(a)
        return flask.jsonify(clean)

@app.route("/vote", methods=["POST"])
def vote():
    # get suggestion identifier
    identifier = flask.request.args.get("id")
    if identifier == None:
        return flask.make_response(("Invalid. Must provide id flag.", 400))
    else:
        for x in votes:
            if x["id"] == identifier:
                x["votes"] += 1
                return flask.make_response(("Successfully voted.", 200))
        return flask.make_response(("Could not find suggestion specified.", 404))

@app.route("/up", methods=["GET"])
def up():
    return flask.jsonify("Yes")

# run
if __name__ == "__main__":
    app.run(HOST, PORT)
