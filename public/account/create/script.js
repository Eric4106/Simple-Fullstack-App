document.getElementById("create").onsubmit = create

var $error = document.getElementById("error")

function create(e) {
    e.preventDefault()

    let username = document.getElementById("username").value
    let password = document.getElementById("password").value

    switch (validUsername(username)) {
        case "length":
            $error.innerHTML = `<h4>Username must be 8 - 32 characters long.</h4>`
            return;//note to self, eric. mention return vs break.
    }
    if (password != document.getElementById("password2").value) {
        $error.innerHTML = `<h4>Your passwords do not match.</h4>`
    }
    switch (validPassword(password)) {
        case "length":
            $error.innerHTML = `<h4>Password must be 8 - 32 characters long.</h4>`
            return;
        case "lower":
            $error.innerHTML = `<h4>Password must contain at least one lowercase letter</h4>`
            return;
        case "upper":
            $error.innerHTML = `<h4>Password must contain at least one uppercase letter</h4>`
            return;
        case "number":
            $error.innerHTML = `<h4>Password must contain at least one number</h4>`
            return;
        default:
            $error.innerHTML = ``
            break;
    }

    fetch("/create", {
        body: JSON.stringify({
            username: username,
            password: password,
            email: document.getElementById("email").value,
            dob: document.getElementById("dob").value
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(res => {
            localStorage.setItem("id", res.id)
            if (res.message) $error.innerHTML = res.message
            else location.href = "/user/profile.html" //consider location.replace("/user/profile.html")
        })
        .catch(err => console.error(err))
}

function validUsername(username) {
    if (username.length < 8 || username.length > 32) return "length"
}

function validPassword(password) {
    if (password.length < 8 || password.length > 32) return "length"
    if (!password.match(".*[a-z].*")) return "lower"
    if (!password.match(".*[A-Z].*")) return "upper"
    if (!password.match(".*[0-9].*")) return "number"
}
