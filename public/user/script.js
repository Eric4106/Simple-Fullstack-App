var $username = document.getElementById("username")

addUserInfo()

function addUserInfo() {
    fetch("/userData")
        .then(res => res.json())
        .then(users => {
            $username.innerHTML = `<strong>${users[parseInt(localStorage.getItem("id")) - 1].username}</strong>`
        })
        .catch(err => console.error(err))
}