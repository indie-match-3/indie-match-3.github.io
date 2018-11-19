var names = ["Assembler", "C", "C++", "Golang", "Python", "C#", "Java", "Php"]

var data = {
	currency: 0,
	// currency: 1000,
	mult: 1.2,
	costs: [1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8],
	increments: [1, 2, 4, 8, 16, 32, 64, 128],
	counts: [0, 0, 0, 0, 0, 0, 0, 0],
	prestige_mult: 1,
}

function save() {
	localStorage.setItem("save", JSON.stringify(data))
	var panel = document.getElementById("autosave_panel")
	panel.style.display = "block"
	setTimeout(() => panel.style.display = "none", 1000)
}

setInterval(save, 30000)

function load() {
	var buf = localStorage.getItem("save")
	
	if(buf == null) {
		save()
	}

	data = JSON.parse(localStorage.getItem("save"))
}

load()

function appendSuffix(num) {
	var suffix = ["bytes", "kb", "Mb", "Gb", "Tb", "Pb", "Xb"]

	var si = num >= 1 ? Math.floor(Math.log(num) / Math.log(1000)) : 0
	num = num / Math.pow(1000, si)

	return Math.round(num * 1e1) / 1e1 + " " + suffix[si]
}

function updateValue(tickdur) {
	var increment = 1
	for(var i = 0; i < data.counts.length; i++)
		increment += data.counts[i] * data.increments[i]

	increment *= data.prestige_mult

	data.currency += increment * (tickdur / 1000)

	document.getElementById("currency").innerText = appendSuffix(data.currency)
	document.getElementById("income").innerText = "+" + appendSuffix(increment) + " / sec"
}

function updateAll(tickdur) {
	updateValue(tickdur)

	var prestige_adds = 0

	for (var i = data.counts.length - 1; i >= 0; i--) {
		prestige_adds += data.counts[i] * data.increments[i]

		var cost = data.costs[i] * Math.pow(data.mult, data.counts[i])
		var upg = document.getElementById("upgrades").childNodes[i]
		upg.childNodes[2].innerText = data.counts[i]
		upg.childNodes[4].innerText = appendSuffix(cost)
	}

	document.getElementById("prestige").innerText = data.prestige_mult
	document.getElementById("adds").innerText = "+ " +  prestige_adds / 100

}

setInterval(() => updateAll(100), 100)

function buyUpgrade(index) {
	var cost = data.costs[index] * Math.pow(data.mult, data.counts[index])
	if(cost <= data.currency) {
		data.counts[index]++
		data.currency -= cost
		cost *= data.mult
	}
}

function appendUpgrade(index) {
	var container = document.createElement("div")
	container.className = "upgrade_panel"

	var text = document.createElement("div")
	text.className = "upgrade_text"
	text.innerText = names[index]
	container.appendChild(text)

	var inc = document.createElement("div")
	inc.className = "upgrade_increment"
	inc.innerText = "+ " + appendSuffix(data.increments[index]) + " / sec"
	container.appendChild(inc)

	var count = document.createElement("div")
	count.className = "upgrade_count"
	count.innerText = data.counts[index]
	container.appendChild(count)
	
	var button = document.createElement("div")
	button.className = "upgrade_button"
	button.innerText = "Buy"
	button.onclick = () => buyUpgrade(index)
	container.appendChild(button)

	var cost = document.createElement("div")
	cost.className = "upgrade_cost"
	cost.innerText = appendSuffix(data.costs[index])
	container.appendChild(cost)

	document.getElementById("upgrades").appendChild(container)
}

function prestige() {
	var prestige_adds = 0
	for (var i = 0; i < data.counts.length; i++)
		prestige_adds += data.counts[i] * data.increments[i]

	data.prestige_mult += prestige_adds / 1e2
	data.currency = 0
	data.counts = [0, 0, 0, 0, 0, 0, 0, 0]
}

for(var i = 0; i < data.costs.length; i++)
	appendUpgrade(i)
