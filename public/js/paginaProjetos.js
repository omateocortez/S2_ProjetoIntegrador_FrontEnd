
let isEditing = false
let token = undefined

document.addEventListener("DOMContentLoaded", function() {
    token = localStorage.getItem('token')
    isEditing = new URLSearchParams(window.location.search).has('proj_edit')
})

document.getElementById('DeleteProject').addEventListener('show.bs.modal', function(event) {
    const projId = event.relatedTarget.getAttribute('data-bs-proj-id')
    const deleteButton = this.querySelector('#delete_absolute_button')

    deleteButton.onclick = function() {
        const token = localStorage.getItem('token')

        if(!token){
            alert('Erro de autenticação.')
            return
        }

        fetch(`projetos/delete/${projId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                window.location.reload()
            }else{
                alert(data.mensagem)
            }
        })
        .catch(err => {
            console.error(err)
            alert('Erro ao deletar projeto.')
        })
    }
})

document.getElementById('form-id').addEventListener('submit', function(event) {
    event.preventDefault()

    const formData = new FormData(this)

    if(isEditing){
        const projId = new URLSearchParams(window.location.search).get('proj_edit')

        fetch(`/projetos/update/${projId}`, {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${token}`,
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                window.location = window.location.pathname
            }else{
                alert(data.mensagem)
            }
        })
        .catch(err => {
            console.error(err)
            alert('Erro ao atualizar projeto.')
        })
    }
    else{ // se NÃO FOR EDIÇÃO, então CRIAR PROJETO NOVO!
        fetch(`/projetos/upload`,{
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${token}`,
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                window.location.reload()
            } else {
                alert(data.mensagem)
            }
        })
        .catch(err => {
            console.error(err)
            alert('Erro ao criar o projeto.')
        })
    }

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

    if (isFuncionario()) {
        botaoAddProj.style.display = 'block'
        document.querySelectorAll('.botaoEditar').forEach(bot => {
            bot.style.display = 'block'
        })
        document.querySelectorAll('.botaoDeletar').forEach(bot => {
            bot.style.display = 'block'
        })
    }
}

