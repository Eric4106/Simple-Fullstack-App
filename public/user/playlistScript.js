var $playlistDiv = document.getElementById("playlist")

fetch(`/playlist/${localStorage.getItem("id")}/${location.search.slice(3)}`)
    .then(res => res.json())
    .then(playlist => {
        $playlistDiv.innerHTML = `
        <div style="background-color: #${playlist.color};">
        <h3>${playlist.title}</h3>
        </div>`
    })
    .catch(err => console.error(err))