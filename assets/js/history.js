let user = null

async function main () {
    user = await getUserDetails()

    if(user != null || user != undefined) {
        document.querySelector(".loading").remove()
    } else {
        window.location.href = "/login"
    }
    return "meow"
}

async function getUserDetails() {
    return await localforage.getItem('user')
}

async function getTransactions() {
    return await localforage.getItem('transactions')
}

window.addEventListener("click", (e) => {
	if (
		e.target.classList.contains("signup") ||
		e.target.classList.contains("signupHeader") ||
		e.target.classList.contains("signupDomain") ||
		e.target.classList.contains("signupTime")
	) {
		let id = e.target.getAttribute("data-id")
		let signupInfo = document.querySelector(`.signupInfo[data-id="${id}"]`)
		signupInfo.classList.toggle("show")
	}
})


async function renderTransactions() {
    let data = await getTransactions()
    let html = showListOfTransactions(data)    
    document.querySelector(".signupsContainer").innerHTML = html
}

document.querySelector(".goBack").addEventListener("click", () => {
    window.location.href = "/"
})

main().then(() => renderTransactions())