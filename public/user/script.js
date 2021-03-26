var $username = document.getElementById("username")

addUserInfo()

function addUserInfo() {
    fetch("/users")
        .then(res => res.json())
        .then(res => {
            if (localStorage.getItem("id")) $username.innerHTML = `<strong>${res[res.length - (parseInt(localStorage.getItem("id")))].username}</strong>`
            else $username.innerHTML = `ERROR: No user inputed`
        })
        .catch(err => console.error(err))
}