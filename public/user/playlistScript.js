var $playlistDiv = document.getElementById("playlist")

fetch(`/playlist/${location.search.slice(3)}`)
    .then(res => res.json())
    .then(playlist => {
        fetch(`/songs/${location.search.slice(3)}`)
            .then(res => res.json())
            .then(songs => {
                $playlistDiv.innerHTML = `
                <div style="background-color: #${playlist.color};">
                <h3>${playlist.title}</h3>
                <div id="songs">
                    ${songs.map(song => `
                    <div class="tile" data-songid=${song.id}>
                        <h4>${song.title}</h4>
                        <h4>By: ${song.artist}</h4>
                        <h4>Genre: ${song.genre}</h4>
                    </div>
                    `).join("")}
                </div>
                </div>`
            })
            .catch(err => console.error(err))
    })
    .catch(err => console.error(err))