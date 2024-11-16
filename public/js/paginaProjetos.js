import { getUserAccessInfo } from '/utils/utils.js'

let userAccessInfo = null
let isEditing = false

document.addEventListener("DOMContentLoaded",  async function() {
    isEditing = new URLSearchParams(window.location.search).has('proj_edit')
    userAccessInfo = await getUserAccessInfo()

    if(userAccessInfo.isFunc){
        const dateInput = document.getElementById('date')
        if (dateInput) {
            const dateValue = dateInput.value
            if (dateValue) {
                const date = new Date(dateValue)
                date.setDate(date.getDate() - 1)
                const formattedDate = date.toISOString().split('T')[0]
                dateInput.value = formattedDate
            }
        }
        
        document.getElementById('botaoAdicionarProjeto').style.display = 'block'
        document.querySelectorAll('.botaoEditar').forEach(botao => {
            botao.style.display = 'block'
        })
        document.querySelectorAll('.botaoDeletar').forEach(botao => {
            botao.style.display = 'block'
        })

        if(isEditing || sessionStorage.getItem('mostrarModalAposReload') === 'true'){
            let modal = new bootstrap.Modal(document.getElementById("exampleModal"))
            modal.show()
            sessionStorage.removeItem('mostrarModalAposReload')
        }
    }
    

})

document.getElementById("addProjetoButton").addEventListener("click", function() {
    if (isEditing){

        isEditing = false

        const url = new URL(window.location.href)
        url.searchParams.delete('proj_edit')
        window.history.pushState({}, '', url.toString())

        sessionStorage.setItem('mostrarModalAposReload', 'true')
        window.location.reload();   
    }

})

document.getElementById('DeleteProject').addEventListener('show.bs.modal', function(event) {
    const projId = event.relatedTarget.getAttribute('data-bs-proj-id')
    const deleteButton = this.querySelector('#delete_absolute_button')

    deleteButton.onclick = function() {
        if(!userAccessInfo || !userAccessInfo.isAuthenticated){
            alert('Erro de autenticação.')
            return
        }

        fetch(`/projetos/delete/${projId}`, {
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
            alert('Erro ao atualizar projeto.')
        })
    }
    else{ // se NÃO FOR EDIÇÃO, então CRIAR PROJETO NOVO!
        fetch(`/projetos/upload`,{
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
            alert('Erro ao criar o projeto.')
        })
    }

})