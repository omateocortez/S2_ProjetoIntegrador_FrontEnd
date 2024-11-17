const jwt = require('jsonwebtoken')

function generateAcessToken(user){
    const payload = { id: user._id, isFunc: user.funcionario, email: user.email }
    return jwt.sign( payload, process.env.ACESS_TOKEN_SECRET, {expiresIn:'15m'} )
}

function generateRefreshToken(user){
    const payload = { id: user._id }
    return jwt.sign( payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'7d'} )
}

module.exports = { generateAcessToken, generateRefreshToken }