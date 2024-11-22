import { getUserAccessInfo } from '/utils/utils.js'

let userAccessInfo = null

document.addEventListener("DOMContentLoaded",  async function() {

    //Faz com que o botão 'voltar' volte pra página na qual o projeto foi aberto.(ex: se abrir pela home volta pra home)
    
    let voltar = document.getElementById('link-voltar')

    voltar.setAttribute('href', document.referrer)

    voltar.onclick = function() {
        history.back()
        return false;
    }

    userAccessInfo = await getUserAccessInfo()

    if(userAccessInfo.isFunc){
        document.getElementById('botaoEditar').style.display = 'block'
    }
    
})