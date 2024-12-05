document.addEventListener('DOMContentLoaded', function(){
        const formulario = document.getElementById('formulario_voluntario')
    
    formulario.addEventListener('submit', async function(event){
        event.preventDefault()
    
        let assunto = 'Formulário Inscrição Voluntariado'
    
        let html = `
        <html>
            <body>
                <h1>Formulário de Inscrição de Voluntário</h1>
                
                <p><strong>Nome Completo:</strong> ${document.getElementById('nome').value}</p>
                <p><strong>Email:</strong> ${document.getElementById('email').value}</p>
                <p><strong>Mensagem:</strong> ${document.getElementById('mensagem').value}</p>
            </body>
        </html>
        `

        let data = {
            assunto: assunto,
            html: html
        }
        
        fetch(`/sendforms`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('Formulário enviado.')
                location.reload()
            } else {
                alert(data.mensagem)
                console.warn('Erro ao enviar formulário!')
            }
        })
        .catch(err => {
            console.error(err)
            alert('Erro ao enviar formulário.')
        })

    })
})