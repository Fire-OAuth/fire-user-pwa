let user

let schemaBuilder = lf.schema.create("userData", 1)

schemaBuilder
    .createTable("User")
    .addColumn("id", lf.Type.INTEGER)
    .addColumn("email", lf.Type.STRING)
    .addColumn("firstName", lf.Type.STRING)
    .addColumn("lastName", lf.Type.STRING)
    .addColumn("profilePic", lf.Type.STRING)
    .addPrimaryKey(["id"], true);

let userDb
let item

schemaBuilder.connect().then(function (db) {
    userDb = db;
    item = db.getSchema().table("User")
})

async function submitForm (type) {

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

    let fireServerURL = 'http://localhost:3003/api/users'
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
        window.location.href = '/';
    }
    else {
        document.querySelector(".errorMessage").innerHTML = response.message;
    }

    return false;
}

async function createItem(data) {
	let row = item.createRow(data)
	return await userDb.insertOrReplace().into(item).values([row]).exec().catch(err => console.log(err))
}