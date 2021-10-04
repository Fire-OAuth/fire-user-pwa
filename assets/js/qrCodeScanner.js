let user
const video = document.createElement("video")
const canvasElement = document.getElementById("qr-canvas")
const canvas = canvasElement.getContext("2d")

const qrResult = document.getElementById("qr-result")
const outputData = document.getElementById("outputData")
const btnScanQR = document.getElementById("btn-scan-qr")
const loadingScreen = document.querySelector(".loadingContainer")

let scanning = false

let schemaBuilder = lf.schema.create("userData", 1)

schemaBuilder
	.createTable("User")
	.addColumn("id", lf.Type.INTEGER)
	.addColumn("_id", lf.Type.STRING)
	.addColumn("email", lf.Type.STRING)
	.addColumn("firstName", lf.Type.STRING)
	.addColumn("lastName", lf.Type.STRING)
	.addColumn("profilePic", lf.Type.STRING)
	.addPrimaryKey(["id"], true)

let userDb
let item

    qrResult.hidden = false;
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
  }
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
function getUserDetails() {
	return new Promise((resolve, reject) => {
		let user
		userDb
			.select()
			.from(item)
			.exec()
			.then((res) => {
				user = res.at(-1)
				resolve(user)
			})
	})
}

async function generateToken(userId, sessionId) {
	let endpointUrl = "http://localhost:3003/api/tokens/generate"

	let response = await fetch(endpointUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId: userId,
			sessionId: sessionId,
		}),
	})

	let responseStatus = response.status
	response = await response.json()

	if (responseStatus == 201) {
		return response.tokenId
	} else {
		alert(response.message)
		window.location.href = "/"
	}
}
