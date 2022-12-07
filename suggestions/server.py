# import required libraries
import requests
import atexit
import signal
import random
import string
import flask
import json
import re

# static variables
NAME = "SUGGESTIONS-SERVER"
HOST, PORT = "192.248.144.13", 80
VOTES = "./votes.json"
PROFANITIES_URL = "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/en"

# fetch list of profanity
profanities = requests.get(PROFANITIES_URL).content.decode().split("\n")[:-1] # -1 get rid of ''
profanities = sorted(profanities, key=len)
profanities.reverse()

# generates random strings
def rand(n: int = 5) -> str:
    return "".join([random.choice(string.ascii_letters) for x in range(n)])

# returns 'string' with all profanity censored
def rid_of_profanity(string: str):
    for x in profanities:
        stopped = False
        last = 0
        while not stopped:
            location = string.lower().find(x, last)
            if location == -1:
                stopped = True
            else:
                print(x)
                string = string[:location] + "".join(["*" if c != " " else " " for c in x]) + string[location+len(x):]
                last = location
    return string

# initialise and load all
app = flask.Flask(NAME)
votes: list[dict[str, str]] = json.load(open(VOTES, "r"))

# on exit, write suggestions
write_out = lambda : json.dump(votes, open(VOTES, "w"), indent=4)
atexit.register(write_out)
signal.signal(signal.SIGTERM, write_out)

# for modifying vals in the future
def make_response(t: tuple[str, int]):
    resp = flask.make_response(t)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Content-Type"] = "text/plain"
    return resp

@app.route("/suggestions", methods=["POST", "GET"])
def suggestions():
    request = flask.request
    # add to
    if request.method == "POST":
        try:
            js: dict[str, str] = json.loads(request.data)
        except:
            return make_response(("Invalid/no JSON.", 400))
        if js.get("content") in ["", None]:
            return make_response(("Invalid JSON: no suggestion content.", 400))
        else:
            if len(js.get("content")) > 60:
                return make_response(("Suggestion cannot be over 60 characters.", 400))
            elif len(js.get("content")) < 4:
                return make_response(("Suggestion must be above 4 characters.", 400))
            count = 0
            for vote in votes:
                if (vote.get("from") == request.remote_addr) if request.remote_addr != HOST else False:
                    count += 1
            if count >= 3:
                return make_response(("You can only post 3 suggestions until the next suggestion-cycle.", 401))
            votes.append({
                "id": rand(),
                "from": request.remote_addr,
                "suggestion": rid_of_profanity(js.get("content")),
                "votes": []
            })
            return make_response(("Successfully added suggestion.", 201))
    # fetch all
    else:
        clean = []
        for x in votes.copy():
            a = x.copy()
            try:
                a.pop("from")
                a["votes"] = len(a["votes"])
            except:
                continue # malformed, ignore
            clean.append(a)
        return make_response((json.dumps(clean), 200))

@app.route("/vote", methods=["POST"])
def vote():
    # get suggestion identifier
    identifier = flask.request.data.decode()
    if identifier == "":
        return make_response(("Invalid. Must provide id flag.", 400))
    else:
        count = 0
        for x in votes:
            for v in x["votes"]:
                if (v["from"] == flask.request.remote_addr) if flask.request.remote_addr != HOST else False:
                    count += 1
        if count >= 3:
            return make_response(("You can only vote 3 times until the next suggestion-cycle.", 401))
        for x in votes:
            if x["id"] == identifier:
                x["votes"].append({
                    "from": flask.request.remote_addr
                })
                return make_response(("Successfully voted.", 201))
        return make_response(("Could not find suggestion specified.", 404))

@app.route("/up", methods=["GET"])
def up():
    return make_response(("", 200))

# run
if __name__ == "__main__":
    app.run(HOST, PORT)
