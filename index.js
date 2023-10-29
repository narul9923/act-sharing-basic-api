var express = require('express')
var db = require('./database')
var app = express()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const auth = require('./auth')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// localhost:3001/
app.get('/', function(req, res) {
    res.json("Hallo")
})

// Ambil semua data products
app.get('/products', function(req, res) {
    let query = `SELECT * FROM products`
    db.query(query, function(err, result) {
        if (err) {
            res.json(err)
        } else {
            res.json(result)
        }
    })
})

// Get detail product
app.get('/product/:id', function(req, res) {
    let id = req.params.id
    let query = `SELECT * FROM products WHERE id = ?`
    db.query(query, [id], function(err, result) {
        if (err) {
            res.json(err)
        } else {
            res.json(result)
        }
    })
})

// Tambah data
app.post('/product', auth, function(req, res) {
    let { nama, harga, deskripsi } = req.body
    let query = `INSERT INTO products SET nama = ?, harga = ?, deskripsi = ?`
    // INSERT INTO products SET nama = 'Mainan', harga = '1500', deskripsi = 'Deskripsi'
    db.query(query, [nama, harga, deskripsi], function(err, result) {
        if (err) {
            res.json(err)
        } else {
            res.json("Success insert")
        }
    })
})

// Delete data
app.delete('/product/:id', function(req, res) {
    let id = req.params.id
    let query = `DELETE FROM products WHERE id = ?`

    db.query(query, [id], function(err, result) {
        if(err) {
            res.json(err)
        } else {
            res.json("Success delete data")
        }
    })
})

// Edit data
app.put('/product/:id', function(req, res) {
    let id = req.params.id // ambil parameter id
    let { nama, harga, deskripsi } = req.body // ambil dari request body

    // query untuk update data
    let query = `UPDATE products SET nama = ?, harga = ?, deskripsi = ? WHERE id = ?`
    db.query(query, [nama, harga, deskripsi, id], function(err, result) {
        if (err) return res.json(err)
        res.json("Success update data")
    })
})

// Query Database
function queryDatabase(query, params) {
    return new Promise((resolve, reject) => {
        db.query(query, params, function(err, result) {
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

// Register 
app.post('/register', async function(req, res) {
    let { nama, email, password } = req.body

    if(!(nama && email && password)) {
        return res.status(400).send("Semua fields wajib diisi")
    }
    
    let queryCheckEmail = `SELECT * FROM users WHERE email = ?`
    const resultCheckEmail = await queryDatabase(queryCheckEmail, [email])
    if (resultCheckEmail.length > 0) {
        return res.status(400).send('Email ini sudah digunakan')
    }

    let encryptPassword = await bcrypt.hash(password, 10)
    let queryInsert = `INSERT INTO users SET nama = ?, email =?, password = ?`
    queryDatabase(queryInsert, [nama, email, encryptPassword])

    return res.send('Anda sudah berhasil daftar. Silahkan anda login')
})

// Login
app.post('/login', async function(req, res) {
    let { email, password } = req.body
    let queryCheckEmail = `SELECT * FROM users WHERE email = ?`
    const resultCheckEmail = await queryDatabase(queryCheckEmail, [email])

    if (resultCheckEmail && (await bcrypt.compare(password, resultCheckEmail[0]['password']))) {
        let user = resultCheckEmail[0]
        const token = jwt.sign(
            { user_id: user['id'], email: user['email'] },
            't0K3nAuthentication',
            {
                expiresIn: "2h"
            }
        )
        user['token'] = token
        res.status(200).json(user)
    } else {
        res.status(400).send('Invalid Credential')
    }
})

var server = require("http").createServer(app)
server.listen('3001', () => {
    var host = server.address().address
    console.log('Running in port  ', host, '3001')
})