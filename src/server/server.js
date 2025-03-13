const express = require('express');
require("dotenv").config();

const db = require("./db");

const app = express();
const port = process.env.PORT;

const indexRoutes = require('/Users/gabriel/Desktop/calendar/src/server/routes/index.js');

app.use(express.json());
app.use('', indexRoutes);


app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});