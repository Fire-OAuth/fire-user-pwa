let fireServerURL = 'http://localhost:3003/api/users'

async function submitForm (type) {

    try {
        let data = {}

        if(type == 'login') {
            data = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            }
        }
        else if(type == 'register') {
            data = {
                email: document.getElementById('email').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                password: document.getElementById('password').value
            }
        }

        let endpoint = type == 'login' ? 'login' : 'register'

        let response = await fetch(`${fireServerURL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        let responseStatus

        if (type == 'register') responseStatus = response.status == 201 ? true : false
        else responseStatus = response.status == 200 ? true : false

        response = await response.json();
        console.log(response)
        if(responseStatus){
            await createItem(response).catch(err => console.log(err))
    
            document.querySelector(".loading").style.display = "flex";
            setTimeout(() => {
                window.location.href = '/';
            }, 2000)
        }
        else {
            document.querySelector(".errorMessage").innerHTML = response.message;
        }
        
    } catch (error) {
        console.log(error)
        document.querySelector(".errorMessage").innerHTML = "Something Happened. Try Again Later";
    }
    
    return false;
}

async function createItem(data) {
    let user = localforage.setItem('user', data)
    return user
}