const express = require('express');
require("dotenv").config();

const db = require("./db");

const app = express();
const port = process.env.PORT;

const indexRoutes = require('./routes/index.js');

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
    const infoMessage = await db.createUser(req.body);
    res.json({message: infoMessage});
});

app.post("/login", async (req, res) =>{
    const infoMessage = await db.login(req.body, res);
    res.json({message: infoMessage});
});

app.post("/requestPasswordRecovery", async (req, res) => {
    const infoMessage = await db.requestPasswordRecovery(req.body);
    res.json({message: infoMessage});
});

app.put("/resetPassword", async (req, res) => {
    const infoMessage = await db.resetPassword(req.body);
    res.json({message: infoMessage});
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});