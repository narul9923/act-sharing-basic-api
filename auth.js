const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token']

    if (!token) {
        return res.status(403).send('Token wajib di isi')
    }

    try {
        const decoded = jwt.verify(token, 't0K3nAuthentication')
        req.user = decoded
    } catch (err) {
        return res.status(401).send('Invalid Token')
    }
    return next()
}

module.exports = verifyToken