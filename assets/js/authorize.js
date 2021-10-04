let user
let urlParams = new URLSearchParams(window.location.search)
let sessionId = urlParams.get('sessionId')
let chatRoomId = urlParams.get('chatRoomId')

console.log({sessionId, chatRoomId})

let schemaBuilder = lf.schema.create("userData", 1)

schemaBuilder
    .createTable("User")
    .addColumn("id", lf.Type.INTEGER)
    .addColumn("_id", lf.Type.STRING)
    .addColumn("email", lf.Type.STRING)
    .addColumn("firstName", lf.Type.STRING)
    .addColumn("lastName", lf.Type.STRING)
    .addColumn("profilePic", lf.Type.STRING)
    .addPrimaryKey(["id"], true);

let userDb
let item

schemaBuilder.connect().then(async function (db) {
    userDb = db;
    item = db.getSchema().table("User")
    user = await getUserDetails()
    if(user != undefined) {
        let fireServerURL = "http://localhost:3003"
        let socket = io(fireServerURL)
        socket.emit("join room", sessionId)
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

    let endpointUrl = "http://localhost:3003/api/tokens/generate"

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