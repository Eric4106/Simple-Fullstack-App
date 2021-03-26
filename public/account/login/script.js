if (localStorage.getItem("id")) {
    location.replace("/user/profile.html")
}

document.getElementById("login").onsubmit = login;

var $error = document.getElementById("error")

function login(e) {
    e.preventDefault()
    fetch("/login", {
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(res => {
            if (res.id) localStorage.setItem("id", res.id)
            if (res.message) $error.innerHTML = res.message
            else location.href = "/user/profile.html" //consider location.replace("/user/profile.html")
        })
        .catch(err => console.error(err))
}