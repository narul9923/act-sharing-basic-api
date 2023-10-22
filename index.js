var express = require('express')
var db = require('./database')
var app = express()

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
app.post('/product', function(req, res) {
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

var server = require("http").createServer(app)
server.listen('3001', () => {
    var host = server.address().address
    console.log('Running in port  ', host, '3001')
})