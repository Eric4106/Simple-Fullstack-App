document.getElementById("create").onsubmit = create

let $error = document.getElementById("error")

function create(e) {
    let valid = false
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    e.preventDefault()
    switch (validUsername(username)) {
        case "length":
            $error.innerHTML = `<h3>Username must be 8 - 32 characters long.</h3>`
            break;
    }
    if (password != document.getElementById("password2").value) {
        $error.innerHTML = `<h3>Your passwords do not match.</h3>`
    }
    switch (validPassword(password)) {
        case "length":
            $error.innerHTML = `<h3>Password must be 8 - 32 characters long.</h3>`
            break;
        case "lower":
            $error.innerHTML = `<h3>Password must contain at least one lowercase letter</h3>`
            break;
        case "upper":
            $error.innerHTML = `<h3>Password must contain at least one uppercase letter</h3>`
            break;
        case "number":
            $error.innerHTML = `<h3>Password must contain at least one number</h3>`
            break;
    }
    fetch("/create", {
        body: JSON.stringify({
            username: usernmae,
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
            if (res.message == "Your account was successfully created.") location.href = "/user/profile.html" //consider location.replace("/user/profile.html")
            alert(res.message)//make this an html later
        })
        .catch(error => console.error(error))
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