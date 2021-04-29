var $playlistTiles = document.getElementsByClassName("tiles")[0]
var $playlistRow = document.getElementsByClassName("row")[0]
var playlistTileCount = 0
//var $songs = document.getElementsByClassName("songs")
//var $artists = document.getElementsByClassName("artists")
//var $genres = document.getElementsByClassName("genres")

fetch("/playlists")
    .then(res => res.json())
    .then(playlists => {
        $playlistTiles.innerHTML = playlists.map(playlist => {
            if (playlist.user_id != localStorage.getItem("id")) return
            if (playlistTileCount < 4) playlistTileCount++
            else return
            return `
            <div class="tile" background-color="#${playlist.color}">
                <h3>${playlist.title}</h3>
                <a href="/playlist/${playlist.id}">View Playlist</a>
            </div>
            `
        }).join(``)
    })
    .catch(err => console.error(err))

$playlistRow.style.width = `${(playlistTileCount + 1) * 20}%`