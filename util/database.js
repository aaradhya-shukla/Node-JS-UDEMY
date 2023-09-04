const mysql= require('mysql2');

const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    database:'node-complete',
    password:'Cse&2088'
})

module.exports=pool.promise();