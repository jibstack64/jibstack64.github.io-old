// ip and port for suggestions server
const IP = "192.248.144.13";
const PORT = 80;
const URL = "https://" + IP + ":" + PORT

function applyCss() {
    var code = document.getElementById("code");
    var styling = code.value;
    // add to style object
    var ps = document.head.getElementsByTagName("style");
    if (ps.length > 0) {
        ps = ps[0];
        ps.innerHTML = styling;
        return;
    } else {
        ps = document.createElement("style");
        ps.innerHTML = styling;
        document.head.append(ps);
        return;
    }
}

// 100% mine :) (https://www.w3schools.com/howto/howto_js_slideshow.asp)
let slideIndex = 1;
showSlides(slideIndex);
function moveSlide(n) {
    showSlides(slideIndex += n);
}
function currentSlide(n) {
    showSlides(slideIndex = n);
}
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    var sl = slides[slideIndex-1];
    if (sl == undefined) {
        return;
    } else {
        slides[slideIndex-1].style.display = "block";
    }
} 

// loads the appropriate styling depending on whether the user is on mobile or pc
function loadAppropriateStylings() { 
    // load correct css
    var elem = document.head.getElementsByTagName("link");
    if (elem.length > 0) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            elem[0]["href"] = "mobile.css";
        } else {
            elem[0]["href"] = "styles.css";
        }
    }

    showSlides(1);
    suggestionsUpVisual();
}

function suggestionsUpVisual() {
    var status = document.getElementById("status");
    var input = document.getElementById("suggestion-input");
    var submit = document.getElementById("submit-button")
    var infield = document.getElementById("infields");
    function applyStyle(success) {
        if (success) {
            status.className = "online";
            status.innerHTML = "ONLINE";
            submit["style"] = "";
            infield["style"] = "";
            submit.className = "hlinked";
            submit.removeAttribute("disabled");
            input["style"] = "";
            input.removeAttribute("disabled");
        } else {
            status.className = "offline";
            status.innerHTML = "OFFLINE";
            submit["style"] = "cursor: not-allowed;";
            submit.className = "hlinked-nohover";
            submit["disabled"] = "";
            infield["style"] = "cursor: not-allowed;"
            input["style"] = "pointer-events: none;";
            input["disabled"] = "";
        }
    }
    let xhr = new XMLHttpRequest();
    xhr.open("GET", URL + "/up");
    xhr.send();
    xhr.onload = function() {
        if (xhr.status != 200) {
            applyStyle(false);
        } else {
            applyStyle(true);
        }
        updateSuggestions();
    }
    xhr.onerror = function() {
        applyStyle(false);
    }
}

function voteFor(id) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", URL + "/vote")
    xhr.send(id);
    xhr.onload = function() {
        alert(xhr.responseText);
        updateSuggestions();
    }
}

function updateSuggestions() {
    var sugTable = document.getElementById("suggestions-table");
    let xhr = new XMLHttpRequest();
    xhr.open("GET", URL + "/suggestions");
    xhr.send();
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.responseText);
            suggestionsUpVisual();
        } else {
            for (x of JSON.parse(xhr.response)) {
                var newElem = document.createElement("tr");
                newElem.id = x["id"];
                newElem.style = "display: flex; align-items: stretch;"
                var newElemSugg = document.createElement("th");
                newElemSugg.innerHTML = x["suggestion"];
                newElemSugg.className = "suggestion-table-pusher";
                newElemSugg.style = "word-wrap: break-word;"
                var newElemVotes = document.createElement("th");
                newElemVotes.innerHTML = x["votes"];
                newElemVotes.className = "vote-num";
                var newElemButton = document.createElement("button");
                newElemButton.innerHTML = "Vote";
                newElemButton.className = "vote-button";
                newElemButton.style = "float: center; height: auto;"
                newElemButton.setAttribute("onclick", "voteFor(\"" + String(x["id"]) + "\")");
                var childToRemove = document.getElementById(x["id"]);
                if (childToRemove != undefined && childToRemove != null) {
                    sugTable.removeChild(childToRemove);
                }
                newElem.append(newElemSugg, newElemVotes, newElemButton);
                sugTable.appendChild(newElem);
            }
        }
    }
    xhr.onerror = function() {
        alert("Error fetching suggestions. Is the server down?");
        suggestionsUpVisual();
    }
}

// suggestion code
function submitSuggestion() {
    // get suggestion text
    var sugIn = document.getElementById("suggestion-input");
    if (sugIn.value == "") {
        return;
    } else {
        var value = sugIn.value;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", URL + "/suggestions");
        xhr.send(JSON.stringify({
            "content": value
        }));
        xhr.onload = function() {
            if (xhr.status == 201) {
                sugIn.value = "";
                updateSuggestions();
            }
            alert(xhr.responseText);
        }
        xhr.onerror = function() {
            alert("Error posting your suggestion. Is the server online?");
            suggestionsUpVisual();
        }
    }
}
