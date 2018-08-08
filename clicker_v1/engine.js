function start() {
	var table = document.getElementById('main_panel');
	for(var i = 0; i < 25; i++) {
		var elem = document.createElement("div");
		elem.id = "cell";
		table.appendChild(elem);
		let el = elem;
		elem.onclick = () => {
			el.className = "active";
		}
	}
}