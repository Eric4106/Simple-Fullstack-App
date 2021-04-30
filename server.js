const express = require('express')
const sqlite3 = require('sqlite3')
const app = new express()
const db = new sqlite3.Database('./db/dotify.db')

app.use(express.static('public'))
app.use(express.json())

app.get("/", (req, res) => {//For future reference - https://expressjs.com/en/guide/routing.html
    res.redirect("/home/index.html")
})

app.get("/playlists/*", (req, res) => {
    const id = parseInt(req.originalUrl.slice(11))
    if (isNaN(id)) return
    const playlistsSQL = "SELECT * FROM playlists WHERE user_id = ?"
    db.all(playlistsSQL, [id], (err, rows) => {
        if (err) console.error(err)
        res.send(rows)
    })
})

app.get("/playlist/:userId/:playlistId", (req, res) => {//I think I could have done this better with params or quereys - http://expressjs.com/en/api.html#req.params
    const {userId} = req.params
    const {playlistId} = req.params
    const playlistSQL = "SELECT * FROM playlists WHERE user_id = ? AND id = ?"
    db.get(playlistSQL, [userId, playlistId], (err, row) => {
        if (err) console.error(err)
        if (row) res.send(row)
        else res.redirect("/home/404.html")
    })
})

app.get("/user/*", (req, res) => {
    const id = parseInt(req.originalUrl.slice(6))
    if (isNaN(id)) return
    const userSQL = "SELECT * FROM users WHERE id = ?"
    db.get(userSQL, [id], (err, row) => {
        if (err) console.error(err)
        res.send(row)
    })
})

/**
 * 404 Page | Always keep as final get()
 */
app.get("*", (req, res) => {
    res.redirect("/home/404.html")
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
                    db.run(createSQL, [user.username, user.password, user.email, user.dob], (err) => {
                        if (err) console.error(err)
                        const lastSQL = "SELECT id FROM users WHERE username = ?"
                        db.get(lastSQL, [user.username], (err, row) => {
                            if (err) console.error(err)
                            res.send({
                                id: row.id//Look at using signed tokens - https://www.npmjs.com/package/cookie-parser - http://expressjs.com/en/api.html#res.cookie
                            })
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