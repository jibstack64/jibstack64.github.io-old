function applyCss() {
    var styling = document.getElementById("custom-styling").value;
    if (styling.length < 1) {
        return;
    }
    var st = "";
    for (var i = 0; i < styling.length; i++) {
        if ((i % 54) == 0 && i > 0 || (styling[i+1] == "}" && styling[i] != ";") || styling[i-1] == "{" || styling[i-1] == ";") {
            st += "\n"
        }
        st += styling[i]
    }
    var code = document.getElementById("code")
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