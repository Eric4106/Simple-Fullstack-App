if (!localStorage.getItem("id")) location.replace("/account/login/login.html")

var $username = document.getElementById("username")

fetch(`/user/${localStorage.getItem("id")}`)
    .then(res => res.json())
    .then(user => {
        if (user.username) $username.innerHTML = `<strong>${user.username}</strong>`
        else {
            localStorage.clear()
            location.replace("/account/login/login.html")
        }
    })
    .catch(err => console.error(err))