const express = require("express");
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
// app.set("view engine", "jade")

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'frontend/index.html'), {});
});

app.listen(PORT, () => {
    console.log('Exaple app listening at http://localhost:$(PORT)');
});