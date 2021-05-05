if (document.getElementById("createPlaylist")) document.getElementById("createPlaylist").onsubmit = createPlaylist;
if (document.getElementById("createSong")) {
    document.getElementById("createSong").onsubmit = createSong;
    loadPlaylists(document.getElementById("playlist"))
}

var $error = document.getElementById("error")

function loadPlaylists($options) {
    fetch(`/playlists/${localStorage.getItem("id")}`)
    .then(res => res.json())
    .then(playlists => {
        if (playlists) $options.innerHTML = playlists.map(playlist => `
            <option value="${playlist.id}">${playlist.title}</option>
        `).join("")
        else $error.innerHTML = `<h4>You have no playlists</h4><br><h3><a href="/user/add/playlist.html">Make a playlist first</a></h3>`
    })
    .catch(err => console.error(err))
}

function createPlaylist(e) {
    e.preventDefault()
    fetch("/playlists", {
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
            if (playlist.message) $error.innerHTML = playlist.message
            else location.href = "/user/profile.html"
        })
        .catch(err => console.error(err))
}

function createSong(e) {
    e.preventDefault()
    fetch("/songs", {
        body: JSON.stringify({
            title: document.getElementById("title").value,
            artist: document.getElementById("artist").value,
            genre: document.getElementById("genre").value,
            playlistId: document.getElementById("playlist").value,
            userId: localStorage.getItem("id")
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(song => {
            if (song.message) $error.innerHTML = song.message
            else location.href = `/user/playlist.html?p=${document.getElementById("playlist").value}`
        })
        .catch(err => console.error(err))
}