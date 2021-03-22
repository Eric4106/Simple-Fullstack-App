document.getElementById("create").onsubmit = create;

function create(e) {
    e.preventDefault()
    fetch("/create", {
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
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

function validPassword(password) {//run checks on what we want and don't
    if (password.length < 8) return "length"
    if (!password.match(".*[a-z].*")) return "lower"
    if (!password.match(".*[A-Z].*")) return "upper"
    if (!password.match(".*[0-9].*")) return "number"
    //if (password.match(".*[ ].*")) return "space"
    return "none";
}