function applyCss() {
    var styling = document.getElementById("custom-styling").value;
    if (styling.length < 1) {
        return;
    }
    var st = "";
    for (var i = 0; i < styling.length; i++) {
        if ((i % 54) == 0 && i > 0 || (styling[i+1] == "}" && styling[i] != ";") || styling[i-1] == "{" || styling[i-1] == ";") {
            st += "\n";
        }
        st += styling[i];
    }
    var code = document.getElementById("code");
    code.value = st;
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

// loads the appropriate styling depending on whether the user is on mobile or pc
function loadAppropriateStylings() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        var elem = document.head.getElementsByTagName("link");
        elem[0]["href"] = "mobile.css";
    }
}
