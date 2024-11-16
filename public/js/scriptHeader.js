import { getUserAccessInfo } from '/utils/utils.js'
let userAccessInfo = null

document.addEventListener("DOMContentLoaded", async function() {
    userAccessInfo = await getUserAccessInfo()

    if (userAccessInfo.isAuthenticated) {
        document.getElementById('drop-xs-login').style.display = 'none'
        document.getElementById('drop-md-login').style.display = 'none'
        
        document.getElementById('drop-xs-cadastro').style.display = 'none'
        document.getElementById('drop-md-cadastro').style.display = 'none'

        document.getElementById("drop-xs-logout").style.display = "block"
        document.getElementById("drop-md-logout").style.display = "block"
    }
})

document.getElementById('drop-xs-logout').addEventListener('click', logout)
document.getElementById('drop-md-logout').addEventListener('click', logout)


function logout() {
    fetch('/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Log-out completo.' })
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
        console.log(err)
        alert('Erro ao realizar log-out.')
    })
}