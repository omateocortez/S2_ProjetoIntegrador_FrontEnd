export async function getUserAccessInfo(){
    try{
        const response = await fetch('/auth-info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        const data = await response.json()

        const info = {
            isAuthenticated: false,
            isFunc: false
        }
            
        if(data.ok){
            info.isAuthenticated = true
            if(data.isFunc){
                info.isFunc = true
            }
        }
        
        console.log(info)
        return info
    }catch(err){
        console.log(err)
        return { isAuthenticated: false, isFunc : false}
    }
}