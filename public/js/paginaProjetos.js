
document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem('token')
    
    if (token) {
        const tokenInputs = document.querySelectorAll('input[name="token"]')

        tokenInputs.forEach(input => {
            input.value = token
        })
    }
})

document.getElementById('DeleteProject').addEventListener('show.bs.modal', function(event) {
    const projId = event.relatedTarget.getAttribute('data-bs-proj-id')
    this.querySelector('form').action = '/projetos/delete/' + projId
})

function isFuncionario(){
    const token = localStorage.getItem('token')

    if(!token) return false

    try{
        //por algum motivo jwt ESTÁ UNDEFNINED MESMO COM A PORRA DA CDN NA PÁGINA, POR ISSO N USEI jwt.decode
        const decoded = decodeJWT(token)
        
        return decoded && decoded.isFunc === true
    }catch(err){
        console.error('Erro ao decodificar token:', err)
        return false
    }
}

function decodeJWT(token){
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
}

window.onload = function() {
    
    if(new URLSearchParams(window.location.search).has('proj_edit')){
        new bootstrap.Modal(document.getElementById("exampleModal")).show()
    }
    
    const botaoAddProj = document.getElementById('botaoAdicionarProjeto')

    if (!isFuncionario()) {
        botaoAddProj.style.display = 'none'
        document.querySelectorAll('.botaoEditar').forEach(bot => {
            bot.style.display = 'none'
        })
        document.querySelectorAll('.botaoDeletar').forEach(bot => {
            bot.style.display = 'none'
        })
    }
}

