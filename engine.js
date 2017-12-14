var updateDelay = 500;

var data = {
	money: 0,
	dpc: 1,
	dps: 0,
	exp: 0,
	curr_hp: 1000000,
	curr_mob: 0
}

var mobs = 
[
	{
		hp_max: 1000000,
		exp_mult: 1,
		gold_mult: 1
	}
]

var upgrades = 
[
	{
		name: "Super clicker",
		cost: 10,
		cost_mult: 1.2,
		dpc: 1,
		dps: 0,
		count: 0
	},
	{
		name: "Super clicker - 2",
		cost: 100,
		cost_mult: 1.2,
		dpc: 0,
		dps: 2,
		count: 0
	}
]


function save() {
	localStorage.setItem('data', JSON.stringify(data));
	localStorage.setItem('mobs', JSON.stringify(mobs));
	localStorage.setItem('upgrades', JSON.stringify(upgrades));
}

function getFromStorage(v, key) {
	var val = JSON.parse(localStorage.getItem(key));
	if(val != null && val.length != undefined && val.length < v.length) {
		return v;
	}
	return val ? val : v;
}

function load() {
	data = getFromStorage(data, 'data');
	mobs = getFromStorage(mobs, 'mobs');
	upgrades = getFromStorage(upgrades, 'upgrades');
}

function update() {
	document.getElementById("money").innerHTML = Math.floor(data.money);
	document.getElementById("exp").innerHTML = Math.floor(data.exp);
	document.getElementById("dpc").innerHTML = data.dpc;
	document.getElementById("dps").innerHTML = data.dps;

	for(var i = 0; i < upgrades.length; i++) {
		document.getElementById("upcost-" + i).innerHTML = Math.floor(upgrades[i].cost);
		document.getElementById("upcount-" + i).innerHTML = upgrades[i].count;
	}

	document.getElementById("curr_hp").innerHTML = Math.floor(data.curr_hp);
	document.getElementById("hp_max").innerHTML = mobs[data.curr_mob].hp_max;

	save();
}

function increment() {
	data.money += mobs[data.curr_mob].gold_mult * data.dpc;
	data.exp += mobs[data.curr_mob].exp_mult * data.dpc;
	data.curr_hp -= data.dpc;

	// update();
}

function idleIncrement() {
	data.money += mobs[data.curr_mob].gold_mult * data.dps / (1000 / updateDelay);
	data.exp += mobs[data.curr_mob].exp_mult * data.dps / (1000 / updateDelay);
	data.curr_hp -= data.dps / (1000 / updateDelay);

	update();
}

function genUpgradesTable() {
	var ups = document.getElementsByClassName("upgrades-table")[0];
	for(let i = 0; i < upgrades.length; i++) {
	    var child = document.createElement("tr");
	    var item = ups.appendChild(child);

	    var name = document.createElement("td");
	    name.innerHTML = upgrades[i].name;
	    item.appendChild(name);

	    var cost = document.createElement("td");
	    cost.innerHTML = "<span id=\"upcost-" + i + "\">" + Math.floor(upgrades[i].cost) + "</span> money";
	    item.appendChild(cost);

	    var dpc = document.createElement("td");
	    dpc.innerHTML = upgrades[i].dpc;
	    item.appendChild(dpc);

	    var dps = document.createElement("td");
	    dps.innerHTML = upgrades[i].dps;
	    item.appendChild(dps);

	    var count = document.createElement("td");
	    count.innerHTML = "<span id=\"upcount-" + i + "\">" + upgrades[i].count + "</span>";
	    item.appendChild(count);

	    var buy = document.createElement("td");
	    buy.innerHTML = "<button class=\"buy_button\" onclick=\"buy_upgrade(" + i + ")\">Buy</button>";
	    item.appendChild(buy);
	}
}

function buy_upgrade(i) {
	if(data.money >= upgrades[i].cost) {
		data.dpc += upgrades[i].dpc;
		data.dps += upgrades[i].dps;
		data.money -= upgrades[i].cost;
		upgrades[i].cost *= upgrades[i].cost_mult;
		upgrades[i].count++;

		// update();
	}
}

function showTab(num) {
	var tabs = document.getElementsByClassName("tabs");
	for(var i = 0; i < tabs.length; i++) {
		if(tabs[i].id == ("tab-" + num))
			tabs[i].style.display = "block";
		else
			tabs[i].style.display = "none";
	}
}

function init() {
	load();
	genUpgradesTable();

	var t = setInterval(idleIncrement, updateDelay)

	// update();
}
