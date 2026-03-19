const express = require("express");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Server and database are working!");
});

app.post("/register", (req, res) => {
    const { username, password } = req.body;

    const query = "INSERT INTO users (username, password) VALUES (?, ?)";

    db.run(query, [username, password], (err) => {
        if (err) {
            return res.send("Error creating user");
        }

        res.send("User created! <a href='/login.html'>Login</a>");
    });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username = ? AND password = ?";

    db.get(query, [username, password], (err, user) => {
        if (err) {
            return res.send("Error logging in");
        }

        if (user) {
            res.redirect("/chat.html");
        } else {
            res.send("Invalid login <a href='/login.html'>Try again</a>");
        }
    });
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});