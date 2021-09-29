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

async function submitForm () {
    let username = document.getElementById('logUsername').value;
    let password = document.getElementById('logPassword').value;

    let data = {
        username: username,
        password: password
    };

    let response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    response = await response.json();
    console.log(response)
    if(response.success){
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