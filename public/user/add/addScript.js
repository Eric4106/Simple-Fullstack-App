document.getElementById("createPlaylist").onsubmit = createPlaylist;

var $error = document.getElementById("error")

function createPlaylist(e) {
    e.preventDefault()
    fetch("/playlist", {
        body: JSON.stringify({
            title: document.getElementById("title").value,
            color: document.getElementById("color").value.slice(1),
            userId: localStorage.getItem("id")
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(playlist => {
            let id = JSON.stringify(playlist)
            console.log(parseInt(id.slice(23, id.length - 1)))
            if (playlist.message) $error.innerHTML = playlist.message
        })
        .catch(err => console.error(err))
}