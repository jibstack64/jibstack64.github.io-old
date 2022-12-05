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

// loads the appropriate styling depending on whether the user is on mobile or pc
function loadAppropriateStylings() { 
    // reset css textarea
    var area = document.getElementById("code");
    area.value = area.innerHTML;
    // load correct css
    var elem = document.head.getElementsByTagName("link");
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        /*elem[0]["href"] = "mobile.css";*/
        // for now
        elem[0]["href"] = "styles.css";
    } else {
        elem[0]["href"] = "styles.css";
    }
}
