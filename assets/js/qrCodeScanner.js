let fireServerURL = "http://localhost:3003"
let endpointUrl = "http://localhost:3003/api/tokens/generate"

let user = null
const video = document.createElement("video")
const canvasElement = document.getElementById("qr-canvas")
const canvas = canvasElement.getContext("2d")

const qrResult = document.getElementById("qr-result")
const outputData = document.getElementById("outputData")
const btnScanQR = document.getElementById("btn-scan-qr")
const loadingScreen = document.querySelector(".loadingContainer")

let scanning = false

qrcode.callback = async (data) => {
	if (data) {
		
		data = JSON.parse(data)

		user = await getUserDetails()
		
		if (user != null || user != undefined) {
			let sessionId = data.sessionId
			let socket = io(fireServerURL)
			socket.emit("join room", sessionId)

			let userId = user._id
			let token = await generateToken(userId, sessionId)

			let dataToBeSentThroughSocket = {
				token: token,
				sessionId: sessionId,
			}

			socket.emit("authorized token", dataToBeSentThroughSocket)

			let urlToBeAdded = decodeURIComponent(data.url)
			
			await addToTransaction(urlToBeAdded, "QR", token)

			loadingScreen.style.display = "block"
			let image = document.getElementById("loadingGif")
			image.src = "/assets/images/done.gif"

			setTimeout(() => {
				window.close()
			}, 2000)
			
		} else {
			window.location.href = "/login.html"
		}
		
		video.srcObject.getTracks().forEach((track) => {
			track.stop()
		})
		
	}
}

btnScanQR.onclick = () => {
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
	document.querySelector(".startInfo").remove()
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
