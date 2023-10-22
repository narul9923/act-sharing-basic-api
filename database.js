let mysql = require('mysql2')

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'toko'
})

connection.connect(function(error) {
    if(error) {
        console.log(error)
    } else {
        console.log('koneksi berhasil')
    }
})

module.exports = connection