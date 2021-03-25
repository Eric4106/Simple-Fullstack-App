const express = require('express')
const sqlite3 = require('sqlite3')
const app = new express()
const db = new sqlite3.Database('./db/dotify.db')

app.use(express.static('public'))
app.use(express.json())

app.get("/", (req, res) => {//For future reference- https://expressjs.com/en/guide/routing.html
    console.log(`Visior: ${req.ip} on main route`)
    res.redirect("/home/index.html")
})

app.get("/userData", (req,res) => {
    const userSql = "SELECT * FROM users"
    db.all(userSql, [], (err, rows) => {
        if (err) console.error(err)
        res.send(rows)
    })
})

/**
 * 404 Page | Always keep as final get()
 */
app.get("*", (req, res) => {
    res.send(`
    <h1>Error 404</h1><br>
    <p>Sorry. The page you are looking for does not exist.</p>
    <a href="/home/index.html">Back to home</a>`)
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
                    db.run(createSQL, [user.username, user.password, user.email, user.dob], (err) => {
                        if (err) console.error(err)
                        if (!this.lastID) this.lastID = 0
                        res.send({
                            id: this.lastID
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