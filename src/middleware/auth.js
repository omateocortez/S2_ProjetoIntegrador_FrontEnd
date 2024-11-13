const jwt = require('jsonwebtoken')

const User = require('../../schemas/Usuario')

const {generateAcessToken} = require('../middleware/genTokens')

const checkTokens = async (req, res, next) => {
    const accessToken = req.cookies.accessToken || req.body.accessToken
    const refreshToken = req.cookies.refreshToken ||  req.body.refreshToken

    if (!accessToken) {
        if(!refreshToken){
            return res.status(403).json({ ok:false, mensagem: 'Refresh token inválido ou expirado.'})
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            
            const user = await User.findById(decoded.id)
            
            if(!user){
                return res.status(403).json({ ok: false, mensagem: 'Erro ao buscar usuário.'})
            }
                
            const newAccessToken = generateAcessToken(user)

            res.cookie('accessToken', newAccessToken, { 
                httpOnly: true,
                secure: true, 
                maxAge: 15 * 60 * 1000, //15min
                sameSite: 'Lax'
            })
        }catch(err){
            console.log(err)
            return res.status(403).json({ ok:false, mensagem: 'Erro ao recarregar token de acesso.'})
        }
    }

    jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(403).json({  ok:false, mensagem: 'Token inválido ou expirado' })
        }
        
        req.user = decoded
        next()
    })
}

module.exports = checkTokens