var $username = document.getElementById("username")

addUserInfo()

function addUserInfo() {
    fetch("/users")
        .then(res => res.json())
        .then(users => {
            if (users[parseInt(localStorage.getItem("id")) - 1]) $username.innerHTML = `<strong>${users[parseInt(localStorage.getItem("id")) - 1].username}</strong>`
            else $username.innerHTML = `ERROR: No user inputed`
        })
        .catch(err => console.error(err))
}