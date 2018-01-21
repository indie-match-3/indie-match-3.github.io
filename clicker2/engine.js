var c = 0;

var hp = 10, hp_max = 10;

function increment() {
	var counter = document.getElementById("counter");
	var hpF = document.getElementById("hp");
	var clickB = document.getElementById("click")

	c++;
	hp--;
	counter.innerHTML = c;

	if (hp <= 0) {
		hp = hp_max;
		clickB.src="archer.png";
	}
	
	hpF.innerHTML = hp;
}
