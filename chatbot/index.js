(async () => {
const tmi = require("tmi.js");
const fetch = require("node-fetch");
const app = require("express")();
const port = 9768;
var user = {name: process.env.CHANNEL};
var apikey = process.env.APIKEY;
var room = user.name;

if (!user.name || !apikey)
	throw new Error(`
You must set the CHANNEL and APIKEY environment variable
where CHANNEL is your Twitch username, and APIKEY is your OAuth key from
https://twitchapps.com/tmi/
`);

var options = {
	options: {
		debug: false
	},
	connection: {
		cluster: "aws",
		reconnect: true
	},
	identity: {
		username: user.name,
		password: apikey
	}
};

apikey = apikey.replace("oauth:", "");

console.log("Fetching data..");
await getUserData(user.name);
await getRooms(user.id);
console.log("Data fetched!");

var client = new tmi.client(options);
client.connect();

client.on("connected", (address, port) => {
	console.log(`Connected to ${address}:${port}.`);
	console.log("Joining default room (main chat).");
	client.join(user.name);
});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/status", (req, res) => {
	res.send("ok");
});

app.get("/username", (req, res) => {
	res.send(user.name);
});

app.get("/id", async (req, res) => {
	res.send(user.id);
});

app.get("/profilepic", async (req, res) => {
	res.send(user.profilepic);
});

app.get("/rooms", async (req, res) => {
	res.send(user.rooms);
});

app.get("/setroom", (req, res) => {
	var rm = req.query["room"];
	if (rm) {
		if (rm === "main") rm = user.name;
		else rm = `chatrooms:${user.id}:${rm}`;
		if (changeRoom(rm)) console.log(`Changing rooms (to ${rm})`);
	}
	res.send("");
});

app.get("/speak", (req, res) => {
	var message = decodeURI(req.query["message"]);
	client.say(room, message);
	res.send("");
});

function changeRoom(newRoom) {
	if (newRoom === room) return false;
	client.part(room);
	console.log(`Parted room: ${room}`);
	room = newRoom;
	client.join(room).catch((err) => {
		throw new Error(`Could not switch rooms. (To: ${newRoom}).\nError:${err}`);
	});
	console.log(`Joined room: ${room}`);
}

async function getUserData(username) {
	try {
		var req = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
			headers: {
				"Accept": "application/json",
				"Client-ID": "abe7gtyxbr7wfcdftwyi9i5kej3jnq"
			}
		});
		var res = await req.json();
		if (res["error"] || !res["data"].length) {
			throw new Error(`Could not fetch data.\n${res}`);
		}
		user.id = res["data"][0].id;
		user.profilepic = res["data"][0].profile_image_url;
	} catch (e) {
		throw new Error(`Could not fetch data.\n${e}`);
	}
}

async function getRooms(id) {
	try {
		var req = await fetch(`https://api.twitch.tv/kraken/chat/${id}/rooms`, {
			headers: {
				Accept: "application/vnd.twitchtv.v5+json",
				Authorization: `OAuth ${apikey}`
			}
		});
		var res = await req.json();
		if (res["error"])
			throw new Error(`Could not fetch data.\n${res}`);
		user.rooms = res.rooms;
	} catch (e) {
		throw new Error(`Could not fetch data.\n${e}`);
	}
}

app.listen(port, () => console.log(`Express server listening on port ${port}.`));
})();