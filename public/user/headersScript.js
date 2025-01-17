var $playlistTiles = document.getElementsByClassName("tiles")[0]
var $playlistMore = document.getElementsByClassName("more")[0]
var playlistTileCount = 0
//var $songs = document.getElementsByClassName("songs")
//var $artists = document.getElementsByClassName("artists")

fetch(`/playlists/${localStorage.getItem("id")}`)
    .then(res => res.json())
    .then(playlists => {
        $playlistTiles.innerHTML = playlists.map(playlist => {
            if (playlistTileCount < 4) playlistTileCount++
            else return
            return `
            <div class="tile" style="background-color: #${playlist.color};">
                <h3><strong>${playlist.title}</strong></h3>
                <h3><a href="/user/playlist.html?p=${playlist.id}">View Playlist</a></h3>
            </div>
            `
        }).join("")
        if (playlistTileCount == 0) {
            $playlistMore.innerHTML = `<h3>You have no playlists</h3><h3><a href="./add/playlist.html">&plus; Add Playlists</a></h3>`
        }
        else {
            $playlistTiles.style.width = `${playlistTileCount * 20}%`
            for (let i = 0; i < $playlistTiles.childElementCount; i++) {
                $playlistTiles.children[i].style.width = `${100 / playlistTileCount}%`
            }
        }
    })
    .catch(err => console.error(err))