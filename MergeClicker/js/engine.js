var elems = [] // прямой порядок, в то время как els - обратный

function clickElem (n) {
	var els = document.getElementById("elems")
	elem = els.childNodes[elems.length - n - 1]

	if(elems[n].currClicks < elems[n].elem.clicksNeeded) {
		elems[n].currClicks++
		elem.childNodes[0].childNodes[1].innerHTML = elems[n].currClicks
	}

	console.log("clicked " + n)
}

function mergeClick (n) {
	var elem = elems[n]

	if(elem.currClicks < elem.elem.clicksNeeded) {
		return
	}

	var elem2 = null
	var i = 0
	for(i = 0; i < elems.length; i++) {
		if(elems[i].elem.lvl == elem.elem.lvl &&
		   elems[i].elem.clicksNeeded == elem.elem.clicksNeeded &&
		   elems[i].currClicks == elem.currClicks &&
		   i != n) {
			elem2 = elems[i]
			break
		}
	}

	if(elem2 == null) {
		return
	}
	
	var els = document.getElementById("elems")
	var el1 = els.childNodes[elems.length - i - 1], el2 = els.childNodes[elems.length - n - 1]

	els.removeChild(el1)
	els.removeChild(el2)

	elems.splice(i)
	elems.splice(n)

	createElem (elem.elem.lvl, true)
}

function createElem (n, atEnd) {
	var elem = {
		elem: mergableUnits[n],
		currClicks: 0
	}

	var table = document.createElement("table")
	var tr1 = document.createElement("tr")
	var tr2 = document.createElement("tr")
	var description = document.createElement("td")
	var curr = document.createElement("td")
	var needed = document.createElement("td")
	var merge = document.createElement("td")
	var mergeButton = document.createElement("button")

	description.className = "description"
	description.rowSpan = 2
	description.innerHTML = "Level " + elem.elem.lvl + " (+" + elem.elem.income + " coin per second)"
	
	tr1.appendChild(description)
	
	curr.innerHTML = elem.currClicks

	tr1.appendChild(curr)

	mergeButton.innerHTML = "Merge"
	mergeButton.onclick = (e) => { 
		var i = Array.prototype.indexOf.call(els.childNodes, e.currentTarget.parentElement.parentElement.parentElement)// lol
		mergeClick(elems.length - i - 1)
	}

	merge.appendChild(mergeButton)
	merge.rowSpan = 2

	tr1.appendChild(merge)

	needed.innerHTML = elem.elem.clicksNeeded

	tr2.appendChild(needed)

	table.appendChild(tr1)
	table.appendChild(tr2)
	table.onclick = (e) => { 
		var i = Array.prototype.indexOf.call(els.childNodes, e.currentTarget)
		clickElem(elems.length - i - 1) 
	}

	var els = document.getElementById("elems")
	if(!atEnd) {
		elems.push(elem)
		els.insertBefore(table, els.firstChild)
	} else {
		elems.splice(0, 0, elem)
		els.appendChild(table)
	}
}

function increment () {
	for(var i = 0; i < elems.length; i++) {
		coins += elems[i].elem.income
	}

	document.getElementById("money").innerHTML = coins
}

setInterval(increment, 1000)