import { getUserAccessInfo } from '/utils/utils.js'

let userAccessInfo = null
let isEditing = false

document.addEventListener("DOMContentLoaded",  async function() {
    isEditing = new URLSearchParams(window.location.search).has('noticia_edit')
    userAccessInfo = await getUserAccessInfo()

    if(userAccessInfo.isFunc){
        document.getElementById('botaoAdicionarNoticia').style.display = 'block'
        document.querySelectorAll('.botaoEditar').forEach(botao => {
            botao.style.display = 'block'
        })
        document.querySelectorAll('.botaoDeletar').forEach(botao => {
            botao.style.display = 'block'
        })
        if(isEditing){
            new bootstrap.Modal(document.getElementById("exampleModal")).show()
        }
    }
    

})

document.getElementById('DeleteNews').addEventListener('show.bs.modal', function(event) {
    const noticiaId = event.relatedTarget.getAttribute('data-bs-noticia-id')
    const deleteButton = this.querySelector('#delete_absolute_button')

    deleteButton.onclick = function() {
        if(!userAccessInfo || !userAccessInfo.isAuthenticated){
            alert('Erro de autenticação.')
            return
        }

        fetch(`/Noticias/delete/${noticiaId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => {
            if(response.ok){
                return response.json()
            }else{
                return response.text().then(text => {
                    throw new Error(`Request failed: ${response.status}, Response: ${text}`)
                })
            }
        })
        .then(data => {
            if(data.ok){
                window.location.reload()
            }else{
                alert(data.mensagem)
            }
        })
        .catch(err => {
            console.error(err)
            alert('Erro ao deletar notícia.')
        })
    }
})

document.getElementById('form-id').addEventListener('submit', function(event) {
    event.preventDefault()

    const formData = new FormData(this)

    if(isEditing){
        const noticiaId = new URLSearchParams(window.location.search).get('noticia_edit')

        fetch(`/Noticias/update/${noticiaId}`, {
            method: 'POST',
            credentials: 'include',
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
            alert('Erro ao atualizar notícia.')
        })
    }
    else{ // se NÃO FOR EDIÇÃO, então CRIAR NOTÍCIA NOVA!
        fetch(`/Noticias/upload`,{
            method: 'POST',
            credentials: 'include',
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
            alert('Erro ao criar notícia.')
        })
    }

})