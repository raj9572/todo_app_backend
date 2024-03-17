const jwt = require('jsonwebtoken')
const userSchema = require('../models/Auth')
const { Error } = require('../Utils/responseWrap')



async function middleware(req, res, next) {
    try {
        if (!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
            return res.send(Error(401, "Authorization headers is required 2"))
        }

        const accessToken = req.headers.authorization.split(" ")[1]
        const data = jwt.verify(accessToken, process.env.SECRET_TOKEN)
        req.user = data

        const user = await userSchema.findById(req.user._id)

        if (!user) {
            return res.send(Error("user not Found",401 ))
        }

        next()
    } catch (error) {
        return res.send(Error( error.message,401))
    }
}


module.exports = middleware