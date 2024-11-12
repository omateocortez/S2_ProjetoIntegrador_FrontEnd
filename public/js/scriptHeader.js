document.addEventListener("DOMContentLoaded", function() {
    token = localStorage.getItem('token')
    
    if (token) {
        console.log('A')

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
    localStorage.removeItem('token')
    window.location.reload()
}