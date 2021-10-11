let fireServerURL = "http://localhost:3003"
let endpointUrl = "http://localhost:3003/api/tokens/generate"

let user
let urlParams = new URLSearchParams(window.location.search)
let sessionId = urlParams.get('sessionId')
let chatRoomId = urlParams.get('chatRoomId')
let urlToBeAdded = decodeURIComponent(urlParams.get('url'))

console.log({sessionId, chatRoomId})

let schemaBuilder = lf.schema.create("userData", 1)
let transactionSchemaBuilder = lf.schema.create("transactionData", 2)

schemaBuilder
    .createTable("User")
    .addColumn("id", lf.Type.INTEGER)
    .addColumn("_id", lf.Type.STRING)
    .addColumn("email", lf.Type.STRING)
    .addColumn("firstName", lf.Type.STRING)
    .addColumn("lastName", lf.Type.STRING)
    .addColumn("profilePic", lf.Type.STRING)
    .addPrimaryKey(["id"], true);

transactionSchemaBuilder
    .createTable("Transactions")
    .addColumn("id", lf.Type.INTEGER)
    .addColumn("token", lf.Type.STRING)
    .addColumn("url", lf.Type.STRING)
    .addColumn("time", lf.Type.STRING)
    .addColumn("method", lf.Type.STRING)
    .addPrimaryKey(["id"], true);

let userDb
let item

let transactionDb
let transaction

schemaBuilder.connect().then(async function (db) {
    userDb = db;
    item = db.getSchema().table("User")
    user = await getUserDetails()
    if(user != undefined) {

        let socket = io(fireServerURL)
        socket.emit("join room", sessionId)

        let userId = user._id
        let token = await generateToken(userId, sessionId)

        let dataToBeSentThroughSocket = {
            token: token,
            sessionId: sessionId
        }

        socket.emit("authorized token", dataToBeSentThroughSocket);

        transactionSchemaBuilder.connect().then(async function (db) {
            transactionDb = db
            transaction = db.getSchema().table("Transactions")
            await addToTransaction(urlToBeAdded, "Link", token)
            
            let image = document.getElementById("loadingGif")
            image.src = "/assets/images/done.gif"

            setTimeout(() => {
                window.close()
            }, 2000)
        })
    }
    else {
        window.location.href = "/login.html"
    }
})

function getUserDetails() {
    return new Promise((resolve, reject) => {
        let user;
        userDb
		.select()
		.from(item)
		.exec()
        .then(res => {
            user = res.at(-1);
            resolve(user)
        })
    })
}

async function generateToken (userId, sessionId) {

    let response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            sessionId: sessionId
        })
    })

    let responseStatus = response.status
    response = await response.json()

    if (responseStatus == 201) {
        return response.tokenId
    }
    else {
        alert(response.message)
        window.location.href = "/"
    }
}

async function addToTransaction (url, method, token) {
	console.log({url, method, token})
	return new Promise(async (resolve, reject) => {
		
		let row = transaction.createRow({
			url: url,
			method: method,
			time: new Date().toISOString(),
			token: token
		})

		await transactionDb.insertOrReplace().into(transaction).values([row]).exec().catch((err) => reject(err))
		resolve("Added Transaction to Database")

	})
}