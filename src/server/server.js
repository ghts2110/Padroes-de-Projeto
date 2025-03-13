const express = require('express');
require("dotenv").config();

const db = require("./db");

const app = express();
const port = process.env.PORT;

const indexRoutes = require('/Users/gabriel/Desktop/calendar/src/server/routes/index.js');

app.use(express.json());
app.use('', indexRoutes);

app.get("/users/id", async (req, res) =>{
    const user = await db.selectUser(req.params.id);
    res.json(user);
});

app.get("/users", async (_, res) =>{
    const users = await db.selectUsers();
    res.json(users);
});

app.post("/registration", async (req, res) =>{
    await db.createUser(req.body);
    res.sendStatus(201);
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});