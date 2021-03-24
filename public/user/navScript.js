var overlay = document.getElementsByClassName("overlay")[0]
var buttonsCollection = document.getElementsByClassName("overlay-button")
var buttons = [];
for (let i = 0; i < buttonsCollection.length; i++) {
    buttons[i] = buttonsCollection[i]
}
var navIsOpen = false;

document.getElementsByTagName("body")[0].onclick = anomalousClick

function anomalousClick(event) {
    if (!(event.target.className == "openbtn" || event.target.className == "overlay" || event.target.parentElement.className == "overlay" || event.target.parentElement.className == "overlay-content")) closeNav()
}

function toggleNav() {
    if (navIsOpen) closeNav()
    else openNav()
}

function openNav() {
    navIsOpen = true;
    var width
    if (window.innerWidth <= 400) {
        width = `${window.innerWidth}px`
    }
    else {
        width = "400px"
    }
    overlay.style.width = width
    buttons.forEach(button => {
        button.style.fontSize = "32px"
    })
}

function closeNav() {
    navIsOpen = false
    overlay.style.width = "0px"
    buttons.forEach(button => {
        button.style.fontSize = "0px"
    })
}