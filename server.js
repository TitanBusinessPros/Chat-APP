const express = require("express");
const db = require("./database");

const app = express();

// ✅ IMPORTANT: Railway uses dynamic port
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// home route
app.get("/", (req, res) => {
    res.send("Server and database are working!");
});

// REGISTER
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    try {
        const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        stmt.run(username, password);

        res.send("User created! <a href='/login.html'>Login</a>");
    } catch (err) {
        res.send("Error creating user");
    }
});

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    try {
        const stmt = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
        const user = stmt.get(username, password);

        if (user) {
            res.redirect("/chat.html");
        } else {
            res.send("Invalid login <a href='/login.html'>Try again</a>");
        }
    } catch (err) {
        res.send("Error logging in");
    }
});

// start server
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});