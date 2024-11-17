import { getUserAccessInfo } from '/utils/utils.js'

let userAccessInfo = null

document.addEventListener("DOMContentLoaded",  async function() {
    userAccessInfo = await getUserAccessInfo()

    if(userAccessInfo.isFunc){
        document.getElementById('botaoEditar').style.display = 'block'
    }
    
})