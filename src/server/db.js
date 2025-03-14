const EmailService = require('./RequestPasswordRecovery/EmailService');
const bcrypt = require('bcrypt');
const saltRounds = 10

async function connect() {
    if(global.connection){
        return global.connection.connect();
    }

    const { Pool } = require("pg");
    const pool = new Pool({
        connectionString: process.env.CONECTION_STRING
    });
    
    console.log(process.env.CONECTION_STRING);


    const client = await pool.connect();
    console.log("criou o pool de coneccao");

    const res = await client.query("select now()");
    console.log(res.rows[0]);
    client.release(); 

    global.connection = pool;
    return pool.connect();
}

connect();

async function selectUsers() {
    const users = await connect();
    const sql = "SELECT * FROM users";
    const res = await users.query(sql);

    return res.rows;    
}

async function selectUser(id) {
    const users = await connect();
    const sql = "SELECT * FROM users where ID=$1";
    const res = await users.query(sql, [id]);

    return res.rows;    
}

async function createUser(info) {
    const users = await connect();
    const sql = "SELECT * FROM users WHERE email = $1";
    const email = await users.query(sql, [info.email]);
    
    if(email.rows.length != 0){
        return "Email already registered";
    }


    sql = "INSERT INTO users(username, email, hashedpassword) VALUES ($1, $2, $3)";
    const hashedPassword = await bcrypt.hash(info.password, saltRounds);

    await users.query(sql, [info.name, info.email, hashedPassword]);

    return "registered successfully";
}

async function login(info) {
    const users = await connect();
    const sql = "SELECT * FROM users WHERE email = $1";
    const email = await users.query(sql, [info.email]);
    
    if(email.rows.length == 0){
        return 'Email not found';
    }

    const user = email.rows[0];
    const password = await bcrypt.compare(info.password, user.hashedpassword);

    if (!password) {
        return 'Incorrect password';
    }

    return 'successful login';
}

async function requestPasswordRecovery(info) {
    const data = await connect();
    let sql = "SELECT * FROM users WHERE email = $1";
    const email = await data.query(sql, [info.email]);
    
    if(email.rows.length == 0){
        return 'Email not found';
    }

    sql = "DELETE FROM passwordreset WHERE email = $1";
    await data.query(sql, [info.email]);

    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expirationTime = new Date(Date.now() + 300000).toISOString();
    sql = "INSERT INTO passwordreset(email, resetcode, expiresat) VALUES ($1, $2, $3)";
    await data.query(sql, [info.email, code, expirationTime]);

    try{
        await EmailService.enviarEmail(
            info.email,
            'Código de Recuperação de Senha',
            `Seu código de recuperação é: ${code}\nEste código expira em 5 minutos.`
        );
        return 'Recovery code sent!';
    }catch{
        return 'Error sending email';

    }
    
}

module.exports = {
    selectUsers,
    selectUser,
    createUser,
    login,
    requestPasswordRecovery
}