if (!localStorage.getItem("id")) location.replace("/login/login.html")

var $username = document.getElementById("username")

fetch(`/user/${localStorage.getItem("id")}`)
    .then(res => res.json())
    .then(user => {
        if (user.username) $username.innerHTML = `<strong>${user.username}</strong>`
        else $username.innerHTML = `ERROR: No user inputed`
    })
    .catch(err => console.error(err))