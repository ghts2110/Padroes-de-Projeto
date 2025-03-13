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
    const res = await users.query("SELECT * FROM users");

    return res.rows;    
}

module.exports = {
    selectUsers
}