let user = null

async function main () {
    user = await getUserDetails()

    if(user != null || user != undefined) {
        document.querySelector(".userCard").innerHTML = returnUserCard(user)
        document.querySelector(".loading").remove()
    } else {
        window.location.href = "/login"
    }
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


document.querySelector(".showPreviousSignups").addEventListener("click", async () => {
    let data = await getTransactions()
    let html = showListOfTransactions(data)

    document.querySelector(".showPreviousSignups").remove()

    html = `<div class="heading">Previous Signups</div>` + html

    document.querySelector(".signupsContainer").innerHTML = html
})

document.getElementById("qrAuthorize").addEventListener("click", async () => {
    window.open("/qr", "_blank")
})

main()