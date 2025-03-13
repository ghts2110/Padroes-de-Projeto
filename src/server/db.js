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

module.exports = {
    selectUsers,
    selectUser,
    createUser,
    login
}