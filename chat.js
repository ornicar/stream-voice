(async () => {
url = "http://localhost";
port = 9768;

var elements = {
	info: document.getElementById("info"),
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

async function getUserInfo() {
	try {
		var req = await fetch(`${url}:${port}/userinfo`);
		var res = await req.json();
		return res;
	} catch (e) {
		alert(`Could not fetch user info. Error in console.`);
		console.error(e);
		return [];
	}
}

if (!await serverUp()) {
	elements.info.innerText = `Could not connect to express server (${url}:${port}).`;
	return;
}

var rooms;
[elements.channel.innerText, elements.id.innerText, elements.profilepic.src, rooms] = [...await getUserInfo()];
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