document.getElementById("login").onsubmit = login;

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
            localStorage.setItem("id", res.id)
            if (res.message == "Successful login!") location.href = "/user/profile.html" //consider location.replace("/user/profile.html")
            alert(res.message)//make this an html later
        })
        .catch(error => console.error(error))
}