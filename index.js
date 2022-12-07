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
    // load correct css
    var elem = document.head.getElementsByTagName("link");
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        elem[0]["href"] = "mobile.css";
    } else {
        elem[0]["href"] = "styles.css";
    }

    // also show slide 1
    showSlides(1);
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
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
} 

// suggestion code
function submitSuggestion() {
    alert("Under development - disable for now.");
}