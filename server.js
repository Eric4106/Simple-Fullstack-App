const express = require('express')
const sqlite3 = require('sqlite3')
const app = new express()
const db = new sqlite3.Database('./db/dotify.db')

app.use(express.static('public'))
app.use(express.json())

app.get("/", (req, res) => {//For future reference - https://expressjs.com/en/guide/routing.html
    res.redirect("/home/index.html")
})

app.get("/playlists", (req, res) => {
    const playlistsSQL = "SELECT * FROM playlists"
    db.all(playlistsSQL, [], (err, rows) => {
        if (err) console.error(err)
        res.send(rows)
    })
})

app.get("/playlist/*", (req, res) => {//I think I could have done this better with params or quereys - http://expressjs.com/en/api.html#req.params
    let id = parseInt(req.originalUrl.slice(10, req.originalUrl.length))
    if (isNaN(id)) res.redirect("/home/404.html")
    const playlistSQL = "SELECT * FROM playlists WHERE id = ?"
    db.all(playlistSQL, [id], (err, rows) => {
        if (err) console.error(err)
        if (rows && rows.length > 0) res.send(rows[0])
        else res.redirect("/home/404.html")
    })
})

app.get("/users", (req, res) => {//Look at using signed tokens - https://www.npmjs.com/package/cookie-parser - http://expressjs.com/en/api.html#res.cookie
    const userSQL = "SELECT username FROM users"
    db.all(userSQL, [], (err, rows) => {
        if (err) console.error(err)
        res.send(rows)
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
    db.all(loginSQL, [user.username, user.password], (err, rows) => {//Look at using db.get() instead of db.all() - https://www.sqlitetutorial.net/sqlite-nodejs/query/ - I think all() gives an array when get() gives us an object as the first row the db finds
        if (err) console.error(err)
        if (rows && rows.length > 0) {
            res.send({
                id: rows[0].id
            })
        }
        else {
            res.send({
                message: "Invalid Username or Password"
            })
        }
    })
})

app.post("/create", (req, res) => {
    const user = req.body
    const usernameSQL = "SELECT id FROM users WHERE username = ?"
    db.all(usernameSQL, [user.username], (err, rows) => {
        if (err) console.error(err)
        if (!(rows && rows.length > 0)) {
            const emailSQL = "SELECT id FROM users WHERE email = ?"
            db.all(emailSQL, [user.email], (err, rows) => {
                if (err) console.error(err)
                if (!(rows && rows.length > 0)) {
                    const createSQL = "INSERT INTO users (username, password, email, dob) VALUES (?, ?, ?, ?)"
                    console.log(`INSERT INTO users (username, password, email, dob) VALUES (${user.username}, ${user.password}, ${user.email}, ${user.dob})`)
                    db.run(createSQL, [user.username, user.password, user.email, user.dob], (err) => {
                        if (err) console.error(err)
                        console.log(this)
                        const lastSQL = "SELECT id FROM users WHERE username = ?"
                        db.all(lastSQL, [user.username], (err, rows) => {
                            if (err) console.error(err)
                            res.send({
                                id: rows[0].id
                            })
                            console.log(rows[0].id)
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