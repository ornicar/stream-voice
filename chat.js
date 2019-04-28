(async () => {
url = "http://localhost";
port = 9768;

var elements = {
	settings: document.getElementById("settings"),
	profilepic: document.getElementById("profilepic"),
	channel: document.getElementById("channel"),
	id: document.getElementById("id"),
	rooms: document.getElementById("rooms")
};

async function serverUp() {
	try {
		await fetch(`${url}:${port}/status`);
		return true;
	} catch {
		return false;
	}
}

async function getUsername() {
	try {
		var req = await fetch(`${url}:${port}/username`);
		var res = await req.text();
		return res;
	} catch (e) {
		alert(`Could not fetch username. Error in console.`);
		console.error(e);
		return "Error";
	}
}

async function getID() {
	try {
		var req = await fetch(`${url}:${port}/id`);
		var res = await req.text();
		return res;
	} catch (e) {
		alert(`Could not fetch id. Error in console.`);
		console.error(e);
		return "Error";
	}
}

async function getProfilePic() {
	try {
		var req = await fetch(`${url}:${port}/profilepic`);
		var res = await req.text();
		return res;
	} catch (e) {
		alert(`Could not fetch profile picture. Error in console.`);
		console.error(e);
		return "";
	}
}

async function getRooms() {
	try {
		var req = await fetch(`${url}:${port}/rooms`);
		var res = await req.json();
		return res;
	} catch (e) {
		alert(`Could not fetch rooms. Error in console.`);
		console.error(e);
		return [];
	}
}

if (!await serverUp()) {
	elements.settings.innerText = `Could not connect to express server (${url}:${port}).`;
	return;
}

elements.channel.innerText = await getUsername();
elements.id.innerText = await getID();
elements.profilepic.src = await getProfilePic();
var rooms = await getRooms();
elements.rooms.insertAdjacentHTML("beforeend", `<li class="selected" onclick="fetch('${url}:${port}/setroom?room=main')">Main room</li>`);
for (var i = 0; i < rooms.length; i++) {
	elements.rooms.insertAdjacentHTML("beforeend", `<li onclick="fetch('${url}:${port}/setroom?room=${rooms[i]._id}')">${rooms[i].name} (${rooms[i]._id})</li>`);
}
var children = elements.rooms.children;
for (var i = 0; i < children.length; i++) {
	children[i].addEventListener("click", e => {
		for (var j = 0; j < children.length; j++) {
			children[j].classList.remove("selected");
		}
		e.target.classList.add("selected");
	});
}
})();