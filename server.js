const express = require('express')
const sqlite3 = require('sqlite3')
const app = new express()
const db = new sqlite3.Database('./db/dotify.db')

app.use(express.static('public'))
app.use(express.json())

app.get("/", (req, res) => {//For future reference - https://expressjs.com/en/guide/routing.html
    res.redirect("/home/index.html")
})

app.get("/playlists/:userId", (req, res) => {
    const {userId} = req.params
    const playlistsSQL = "SELECT * FROM playlists WHERE user_id = ?"
    db.all(playlistsSQL, [userId], (err, rows) => {
        if (err) console.error(err)
        res.send(rows)
    })
})

app.get("/playlist/:playlistId", (req, res) => {
    const {playlistId} = req.params
    const playlistSQL = "SELECT * FROM playlists WHERE id = ?"
    db.get(playlistSQL, [playlistId], (err, row) => {
        if (err) console.error(err)
        if (row) res.send(row)
        else res.redirect("/home/404.html")
    })
})

app.get("/songs/:playlistId", (req, res) => {
    const {playlistId} = req.params
    const songsSQL = "SELECT * FROM songs INNER JOIN entries ON songs.id = entries.song_id WHERE playlist_id = ?"
    db.all(songsSQL, [playlistId], (err, rows) => {
        if (err) console.error(err)
        res.send(rows)
    })
})

app.get("/user/:userId", (req, res) => {
    const {userId} = req.params
    const userSQL = "SELECT * FROM users WHERE id = ?"
    db.get(userSQL, [userId], (err, row) => {
        if (err) console.error(err)
        if (row) res.send(row)
        else res.send({})
    })
})

/**
 * 404 Page | Always keep as final get()
 */
app.get("*", (req, res) => {
    res.redirect("/home/404.html")
})

app.post("/playlists", (req, res) => {
    const playlist = req.body
    const playlistSQL = "INSERT INTO playlists (title, color, user_id) VALUES (?, ?, ?)"
    db.run(playlistSQL, [playlist.title, playlist.color, playlist.userId], (err) => {
        if (err) console.error(err)
        res.send({})
    })
})

app.post("/songs", (req, res) => {
    const song = req.body
    const songSQL = "INSERT INTO songs (title, artist, genre) VALUES (?, ?, ?)"//maybe change to be per each user
    db.run(songSQL, [song.title, song.artist, song.genre], function(err) {
        if (err) console.error(err)
        const entrySQL = "INSERT INTO entries (playlist_id, song_id) VALUES (?, ?)"
        db.run(entrySQL, [song.playlistId, this.lastID], (err) => {
            if (err) console.error(err)
            res.send({})
        })
    })
})

app.post("/login", (req, res) => {
    const user = req.body
    const loginSQL = "SELECT id FROM users WHERE username = ? AND password = ?"
    db.get(loginSQL, [user.username, user.password], (err, row) => {
        if (err) console.error(err)
        if (row) res.send({
            id: row.id
        })
        else res.send({
            message: "Invalid Username or Password"
        })
    })
})

app.post("/create", (req, res) => {
    const user = req.body
    const usernameSQL = "SELECT id FROM users WHERE username = ?"
    db.get(usernameSQL, [user.username], (err, row) => {
        if (err) console.error(err)
        if (!row) {
            const emailSQL = "SELECT id FROM users WHERE email = ?"
            db.get(emailSQL, [user.email], (err, row) => {
                if (err) console.error(err)
                if (!row) {
                    const createSQL = "INSERT INTO users (username, password, email, dob) VALUES (?, ?, ?, ?)"
                    db.run(createSQL, [user.username, user.password, user.email, user.dob], function(err) {
                        if (err) console.error(err)
                        res.send({
                            id: this.lastID//Look at using signed tokens - https://www.npmjs.com/package/cookie-parser - http://expressjs.com/en/api.html#res.cookie
                        })
                    })
                }
                else {
                    res.send({
                        message: `The email \`${user.email}\` is already in use`
                    })
                }
            })
        }
        else {
            res.send({
                message: `The username \`${user.username}\` is already in use`
            })
        }
    })
})

app.listen(3000, console.log("Server started"))