import { getUserAccessInfo } from '/utils/utils.js'

let userAccessInfo = null

document.addEventListener('DOMContentLoaded', async function(){

    history.scrollRestoration = "manual"; //bugzinho com o scroll, melhor só resetar...

    userAccessInfo = await getUserAccessInfo()

    const passModal = document.getElementById('changePasswordModal')

    const deleteModal = document.getElementById('deleteModal')

    const toggleInputs = document.querySelectorAll('.custom-toggle-input')

    passModal.addEventListener('show.bs.modal', function(event) {
        
        const userId = event.relatedTarget.getAttribute('data-bs-user-id')
        
        const confirmButton = passModal.querySelector('#confirmarAlterarSenha')

        confirmButton.onclick = function() {
            if(!userAccessInfo || !userAccessInfo.isAuthenticated){
                alert('Erro de autenticação.')
                return
            }

            const nova_senha = document.getElementById('newPassword').value
            const confirma_nova_senha = document.getElementById('confirmPassword').value

            if(nova_senha === confirma_nova_senha){

                const data = {
                    nova_senha: nova_senha
                }


                fetch(`/users/update/${userId}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        console.log('Usuário atualizado.')
                    } else {
                        alert(data.mensagem)
                        checkbox.checked = !isFuncionario //reverte a checkbox
                        console.log('Erro ao atualizar usuário..')
                    }
                })
                .catch(err => {
                    checkbox.checked = !isFuncionario //reverte a checkbox
                    console.error(err)
                    alert('Erro ao atualizar usuário.')
                })
            }
        }
        
    })

    deleteModal.addEventListener('show.bs.modal', function(event) {

        const userId = event.relatedTarget.getAttribute('data-bs-user-id')

        const deleteButton = deleteModal.querySelector('#delete_confirm_button')

        deleteButton.onclick = function() {
            if(!userAccessInfo || !userAccessInfo.isAuthenticated){
                alert('Erro de autenticação.')
                return
            }
    
            fetch(`/users/delete/${userId}`, {
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
                alert('Erro ao deletar usuário.')
            })
        }
    })

    toggleInputs.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const userId = checkbox.getAttribute('data-bs-user-id')
            const isFuncionario = checkbox.checked
            
            const data = {
                funcionario: isFuncionario
            }

            fetch(`/users/update/${userId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    console.log('Usuário atualizado.')
                } else {
                    alert(data.mensagem)
                    checkbox.checked = !isFuncionario //reverte a checkbox
                    console.log('Erro ao atualizar usuário..')
                }
            })
            .catch(err => {
                checkbox.checked = !isFuncionario //reverte a checkbox
                console.error(err)
                alert('Erro ao atualizar usuário.')
            })
        })
    })        
})
