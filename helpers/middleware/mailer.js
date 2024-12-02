const nodeMailer = require('nodemailer')
const User = require('../../schemas/Usuario')

const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: `${process.env.MAILER_USER}`,
        pass: `${process.env.MAILER_PASS}`
    }
})

async function getFuncMails(){
    try{
        const funcionarios = await User.aggregate([
            { $match:{
                funcionario: true,
                recebeForms: true
            }},
            { $project: { email: 1} }
        ])

        let emails = funcionarios.map(user => user.email)

        console.log(emails)
        return emails
    } catch(err){
        console.warn("Falha ao pegar lista de emails.")
        console.error(err)
        return undefined
    }
}

async function enviarEmailFuncionarios(texto_html, assunto){
    const emailList = await getFuncMails()
    
    if(emailList != undefined){
        try{

            const info = await transporter.sendMail({
                from: `Mãos Na Massa <${process.env.MAILER_USER}>`,
                to: emailList,
                subject: assunto,
                html: texto_html
            })
            
            console.log(`Email(s) enviado(s)!\nID:${info.messageId}`)

        }catch(err){
            console.warn("Falha ao enviar email(s).")
            console.error(err)
        }
    }
}

module.exports = {
    enviarEmailFuncionarios
}