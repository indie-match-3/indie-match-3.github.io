var data = {
	money: 10,
	upCost: 10, 
	upCostMulti: 2,
	floors: [
		{
			interest: 0,
			lvl: 0,
			exp: 0,
			expNeeded: 100,
			expNeededMulti: 2,
			expMulti: 1,
			expMultiIncrease: 1.1,
			unlocked: true
		},
		{
			interest: 0,
			lvl: 0,
			exp: 0,
			expNeeded: 100,
			expNeededMulti: 2,
			expMulti: 1,
			expMultiIncrease: 1.2,
			unlocked: false
		},
		{
			interest: 0,
			lvl: 0,
			exp: 0,
			expNeeded: 100,
			expNeededMulti: 2,
			expMulti: 1,
			expMultiIncrease: 1.3,
			unlocked: false
		},
		{
			interest: 0,
			lvl: 0,
			exp: 0,
			expNeeded: 100,
			expNeededMulti: 2,
			expMulti: 1,
			expMultiIncrease: 1.4,
			unlocked: false
		},
		{
			interest: 0,
			lvl: 0,
			exp: 0,
			expNeeded: 100,
			expNeededMulti: 2,
			expMulti: 1,
			expMultiIncrease: 1.5,
			unlocked: false
		}
	]
};

function save() {
	localStorage.setItem("scdata", JSON.stringify(data));
	console.log("saved!");
}

function load() {
	var val = JSON.parse(localStorage.getItem("scdata"));
	if(val != null)
		data = val;
}

function toNormalNumber(n) {
	return n.toPrecision(3);
}

function refresh() {
	document.getElementById("money").innerHTML = toNormalNumber(data.money);
	document.getElementById("interest").innerHTML = toNormalNumber(getIncrement());
	document.getElementsByTagName("a")[0].title = toNormalNumber(data.upCost) + " money";
	document.getElementById("exp 0").innerHTML = toNormalNumber(data.floors[0].exp);
	document.getElementById("exp needed 0").innerHTML = toNormalNumber(data.floors[0].expNeeded);
	document.getElementById("lvl 0").innerHTML = data.floors[0].lvl;

	for(var i = 1; i < 5; i++) {
		if(!data.floors[i].unlocked)
			return;

		document.getElementById(i).style = null;
		document.getElementById("exp " + i).innerHTML = toNormalNumber(data.floors[i].exp);
		document.getElementById("exp needed " + i).innerHTML = toNormalNumber(data.floors[i].expNeeded);
		document.getElementById("lvl " + i).innerHTML = data.floors[i].lvl;
		document.getElementById("title " + i).title = toNormalNumber(data.floors[i - 1].lvl) + " exp";
	}
}

function getIncrement () {
	var inc = data.floors[0].interest;

	for(var i = 0; i < 5; i++)
		inc *= data.floors[i].expMulti;

	return inc;
}

function autoincrement() {
	var i = getIncrement();
	data.money += i;
	data.floors[0].exp += i;

	for(var i = 0; i < 5; i++) {
		if(data.floors[i].exp >= data.floors[i].expNeeded) {
			data.floors[i].exp -= data.floors[i].expNeeded;
			data.floors[i].expNeeded *= data.floors[i].expNeededMulti;
			data.floors[i].expMulti *= data.floors[i].expMultiIncrease;
			data.floors[i].lvl ++;

			if(data.floors[i].lvl >= 1 && i < 4) {
				data.floors[i + 1].unlocked = true;
			}
		}
	}

	refresh();
}

function upgrade() {
	if (data.money >= data.upCost) {
		data.floors[0].interest += 1;
		data.money -= data.upCost;
		data.upCost *= data.upCostMulti;
	}

	refresh();
}

function init() {
	load();
	autoincrement();
	setInterval(autoincrement, 1000);
	setInterval(save, 6000);
}