function applyCss() {
    var styling = document.getElementById("custom-styling").value;
    if (styling.length < 1) {
        return;
    }
    var code = document.getElementById("code")
    code.innerHTML = styling;
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
