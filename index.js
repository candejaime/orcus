const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

// const connection = require('./connection');
const console = require("console");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(session({
    secret: '656578fthbiut764435s',
    resave: true,
    saveUninitialized: true
}));
app.set("view engine", "jade")
session.loggedin = false;

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'frontend/index'), {});
});
app.get('/login', (req, res) => {
    res.render(path.join(__dirname, 'frontend/login'), {});
});

//LOGIN
app.post("/login", (req, res) => {
    const userData = req.body;
    email = userData.email;
    if (userData.email && userData.password) {
        req.session.loggedin, req.session.username, errorLogin = funciones.login(req, res, userData.email, userData.password);
    } else {

    }
});

app.listen(PORT, () => {
    console.log('Exaple app listening at http://localhost:$(PORT)');
});