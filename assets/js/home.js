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

document.getElementById("qrAuthorize").addEventListener("click", async () => {
    window.open("/qr", "_blank")
})

document.querySelector(".historyLogo").addEventListener("click", async () => {
    window.location.href = "/history"
})

main()