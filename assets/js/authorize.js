let fireServerURL = "http://localhost:3003"
let endpointUrl = "http://localhost:3003/api/tokens/generate"

let user = null
let urlParams = new URLSearchParams(window.location.search)
let sessionId = urlParams.get('sessionId')
let chatRoomId = urlParams.get('chatRoomId')
let urlToBeAdded = decodeURIComponent(urlParams.get('url'))

console.log({sessionId, chatRoomId})

async function main () {
    user = await getUserDetails()
    if(user != null || user != undefined) {
        let socket = io(fireServerURL)
        socket.emit("join room", sessionId)

        let userId = user._id
        let token = await generateToken(userId, sessionId)

        let dataToBeSentThroughSocket = {
            token: token,
            sessionId: sessionId
        }

        socket.emit("authorized token", dataToBeSentThroughSocket);

        await addToTransaction(urlToBeAdded, "Link", token)

        let image = document.getElementById("loadingGif")
        image.src = "/assets/images/done.gif"

        setTimeout(() => {
            window.close()
        }, 2000)

    } else {
        window.location.href = "/login.html"

    }
}

main()
