var $playlistTiles = document.getElementsByClassName("tiles")[0]
//var $songs = document.getElementsByClassName("songs")
//var $artists = document.getElementsByClassName("artists")

fetch(`/playlists/${localStorage.getItem("id")}`)
    .then(res => res.json())
    .then(playlists => {
        $playlistTiles.innerHTML = playlists.map(playlist => `
            <div class="tile" style="background-color: #${playlist.color};">
                <h3><strong>${playlist.title}</strong></h3>
                <h3><a href="/user/playlist.html?p=${playlist.id}">View Playlist</a></h3>
            </div>
            `
        ).join("")
    })
    .catch(err => console.error(err))