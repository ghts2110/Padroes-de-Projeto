const express = require('express');
const app = express();
const port = 3000;

const indexRoutes = require('/Users/gabriel/Desktop/calendar/src/server/routes/index.js');

app.use(express.json());
app.use('', indexRoutes);


app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});