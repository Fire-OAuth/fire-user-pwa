// DOM Import fireServerURL && endpointUrl from assets\js\endpoints.js

let user = null
const video = document.createElement("video")
const canvasElement = document.getElementById("qr-canvas")
const canvas = canvasElement.getContext("2d")
const title = document.querySelector(".title")
const authenticating = document.querySelector(".authenticating")

const qrResult = document.getElementById("qr-result")
const outputData = document.getElementById("outputData")
const btnScanQR = document.getElementById("btn-scan-qr")
const loadingScreen = document.querySelector(".loadingContainer")

let scanning = false

qrcode.callback = async (data) => {
	if (data) {
		
		data = JSON.parse(data)

		NProgress.set(0.7)

		user = await getUserDetails()

		
		NProgress.set(0.8)
		
		if (user != null || user != undefined) {
			
			canvasElement.style.display = "none"
			authenticating.style.display = "block"
			title.innerHTML = "Creating OAuth Tokens..."

			try {
				let sessionId = data.sessionId

				if(sessionId == null || sessionId == undefined) {
					title.innerHTML = "Invalid QR Code"
					return
				}

				let socket = io(fireServerURL)
				socket.emit("join room", sessionId)

				let userId = user._id
				let token = await generateToken(userId, sessionId)

				let dataToBeSentThroughSocket = {
					token: token,
					sessionId: sessionId,
				}

				title.innerHTML = "Authenticating with Fire Servers..."

				socket.emit("authorized token", dataToBeSentThroughSocket)

				NProgress.done()

				let urlToBeAdded = decodeURIComponent(data.url)
				
				await addToTransaction(urlToBeAdded, "QR", token)

				loadingScreen.style.display = "block"
				let image = document.getElementById("loadingGif")
				image.src = "/assets/images/done.gif"

				setTimeout(() => {
					try {
						window.close()
					} catch (error) {
						window.location.href = "/"
					}
				}, 2000)
			} catch (err) {
				window.location.reload()
			}
			
		} else {
			window.location.href = "/login"
		}
		
		video.srcObject.getTracks().forEach((track) => {
			track.stop()
		})
		
	}
}

async function main() {
	navigator.mediaDevices
		.getUserMedia({ video: { facingMode: "environment" } })
		.then(function (stream) {
			scanning = true
			qrResult.hidden = true
			btnScanQR.hidden = true
			canvasElement.hidden = false
			video.setAttribute("playsinline", true) // required to tell iOS safari we don't want fullscreen
			video.srcObject = stream
			video.play()
			tick()
			scan()
		})

}

btnScanQR.onclick = () => {
}

function tick() {
	canvasElement.height = video.videoHeight
	canvasElement.width = video.videoWidth
	canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height)

	scanning && requestAnimationFrame(tick)
}

function scan() {
	try {
		qrcode.decode()
	} catch (e) {
		setTimeout(scan, 300)
	}
}

main()