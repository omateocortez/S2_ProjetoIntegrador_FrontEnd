import { getUserAccessInfo } from '/utils/utils.js'

let userAccessInfo = null
let isEditing = false

document.addEventListener("DOMContentLoaded", async function() {
    isEditing = new URLSearchParams(window.location.search).has('noticia_edit')
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

        // Mostra os botões para o usuário com permissão 'func'
        document.getElementById('botaoAdicionarNoticia').style.display = 'block'
        document.querySelectorAll('.botaoEditar').forEach(botao => {
            botao.style.display = 'block'
        })
        document.querySelectorAll('.botaoDeletar').forEach(botao => {
            botao.style.display = 'block'
        })

        // Exibe a row que contém os botões de edição e exclusão
        const botaoRow = document.querySelectorAll('.botaoRow');
        botaoRow.forEach(row => {
            row.classList.remove('d-none');  // Remove 'd-none' para exibir a row
        });

        // Exibe o modal se estiver editando ou após um reload
        if(isEditing || sessionStorage.getItem('mostrarModalAposReload') === 'true'){
            let modal = new bootstrap.Modal(document.getElementById("exampleModal"))
            modal.show()
            sessionStorage.removeItem('mostrarModalAposReload')   
        }
    } else {
        // Se não for 'func', esconde os botões e a row
        const botaoRow = document.querySelectorAll('.botaoRow');
        botaoRow.forEach(row => {
            row.classList.add('d-none');  // Adiciona 'd-none' para esconder a row
        });
    }
})

document.getElementById("addNoticiaButton").addEventListener("click", function() {
    if (isEditing){

        isEditing = false

        const url = new URL(window.location.href)
        url.searchParams.delete('noticia_edit')
        window.history.pushState({}, '', url.toString())

        sessionStorage.setItem('mostrarModalAposReload', 'true')
        window.location.reload();   
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
            alert('Erro ao deletar noticia.')
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
                window.location = window.location.pathname
            }else{
                alert(data.mensagem)
            }
        })
        .catch(err => {
            console.error(err)
            alert('Erro ao atualizar noticia.')
        })
    }
    else{ // se NÃO FOR EDIÇÃO, então CRIAR NOTÍCIA NOVA!
        fetch(`/Noticias/upload`,{
            method: 'POST',
            credentials: 'include',
            body: formData
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
            if (data.ok) {
                window.location.reload()
            } else {
                alert(data.mensagem)
            }
        })
        .catch(err => {
            console.error(err)
            alert('Erro ao criar o noticia.')
        })
    }

})