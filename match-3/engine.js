var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var consts = {
	TileWidth: 40,
	TileHeight: 40,
	WidthBlocks: 10,
	HeightBlocks: 10,
	FieldWidth: this.TileWidth * this.WidthBlocks,
	FieldHeight: this.TileHeight * this.HeightBlocks,

	colors: [
		"#FF0000", // red
		"#16D100", // green +-
		"#00A0B0", // blue
		"#EED200", // yellow
		"#C500FF", // purple
		"#0000FF" // orange
	]
}

function Circle(color) {
	this.color = color;
	this.offsetX = consts.TileWidth / 2;
	this.offsetY = consts.TileHeight/ 2;
	this.radius = (consts.TileHeight + consts.TileWidth) / 5;

	this.draw = function(x, y) {
		ctx.beginPath();
		ctx.arc(x + this.offsetX, y + this.offsetY, this.radius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	this.equal = function(oth) {
		return this.color == oth.color;
	}
}

function Tile(i, j, elem) {
	this.x = j * (consts.TileWidth + 2) + 2;
	this.y = i * (consts.TileHeight + 2) + 2;

	this.elem = elem;
	this.active = false;

	this.reset_elem = function() {
		this.elem_x = this.x;
		this.elem_y = this.y;		
	}

	this.reset_elem();

	this.draw_elem = function() {
		this.elem.draw(this.elem_x, this.elem_y);
	}

	this.draw = function(with_elem = true) {
    	ctx.clearRect(this.x, this.y, consts.TileWidth, consts.TileHeight);
    	ctx.strokeStyle = (this.active ? "red" : "gray");
    	ctx.lineWidth = 2;
    	ctx.strokeRect(this.x, this.y, consts.TileWidth, consts.TileHeight);

    	if(this.elem && with_elem)
	    	this.draw_elem();
	}

	this.equal = function(oth) {
		if(this.elem && oth.elem)
			return this.elem.equal(oth.elem)
		else
			return false;
	}

	this.activate = function() { 
		this.active = true;
	}

	this.deactivate = function() { 
		this.active = false;
	}

	this.swap = function(oth) {
		[this.elem, oth.elem] = [oth.elem, this.elem];
		this.reset_elem();
		oth.reset_elem();
	}
}

function Field(m, n) {
	this.tiles = []
	this.active = {i: -1, j: -1}

	for(var i = 0; i < m; i++) {
		var row = [];
		for(var j = 0; j < n; j++) {
			var colIndex = getRandomInt(0, consts.colors.length);
			var color = consts.colors[colIndex]
			row.push(new Tile(i, j, new Circle(color)))
		}
		this.tiles.push(row);
	}

	this.draw = function() {
		for(var i = 0; i < m; i++) {
			for(var j = 0; j < n; j++) {
				if(this.tiles[i][j])
					this.tiles[i][j].draw();
			}
		}
	}

	this.activate = function(i, j) {
		this.deactivate();
		this.active = {i: i, j: j}

		if(i < 0 || j < 0 || i >= m || j >= n) return;

		if(i != -1 && j != -1)
			this.tiles[i][j].activate();	

	}

	this.deactivate = function() {
		if(this.active.i != -1 && this.active.j != -1) 
			this.tiles[this.active.i][this.active.j].deactivate();
	}

	this.deleteCombos = function() {
		var comboIndexOf = function(combo, tile) {
			for(var i = 0; i < combo.length; i++) {
				if(combo[i].i == tile.i && combo[i].j == tile.j)
					return i
			}

			return -1;
		}

		var find = function(combos, combo) {
			for(var i = 0; i < combos.length; i++) {
				for(var j = 0; j < combo.length; j++) {
					if(comboIndexOf(combos[i], combo[j]) != -1) {
						return i;
					}
				}
			}

			return -1;
		}

		var merge = function(arr1, arr2) {
			var res = arr1
			for(var i = 0; i < arr2.length; i++) {
				if(comboIndexOf(res, arr2[i]) == -1) {
					res.push(arr2[i]);
				}
			}

			return res;
		}

		var combos = []

		// rows
		for(var i = 0; i < m; i++) {
			var combo = [];
			for(var j = 0; j < n; j++) {
				if(combo.length == 0 || this.tiles[i][j].equal(this.tiles[i][j - 1])) {
					combo.push({i: i, j: j});				
				} else {
					if(combo.length >= 3) {
						combos.push(combo);
					}
					combo = [{i: i, j: j}];
				}
			}
			if(combo.length >= 3) {
				combos.push(combo);
			}
		}

		// cols
		for(var j = 0; j < n; j++) {
			var combo = [];
			for(var i = 0; i < m; i++) {
				if(combo.length == 0 || this.tiles[i][j].equal(this.tiles[i - 1][j])) {
					combo.push({i: i, j: j});				
				} else {
					if(combo.length >= 3) {
						var ind = find(combos, combo);
						if(ind != -1) {
							combos[ind] = merge(combos[ind], combo)
						} else {
							combos.push(combo);
						}
					}
					combo = [{i: i, j: j}];
				}
			}

			if(combo.length >= 3) {
				var ind = find(combos, combo);
				if(ind != -1) {
					combos[ind] = merge(combos[ind], combo)
				} else {
					combos.push(combo);
				}
			}
		}

		console.log(combos);

		for(var i = 0; i < combos.length; i++) {
			for(var j = 0; j < combos[i].length; j++) {
				var c = combos[i][j];
				this.tiles[c.i][c.j] = new Tile(c.i, c.j);
			}
		}

		this.draw();
	}

	this.swap = function(i1, j1, i2, j2) {
		var tile1 = this.tiles[i1][j1];
		var tile2 = this.tiles[i2][j2];

		var swapAnimate = function(f, t1, t2, c = 0) {
			var dx = (t1.x - t2.x) / 5;
			var dy = (t1.y - t2.y) / 5;

			if(c == 5) {
				t1.swap(t2);
				f.deleteCombos();
				return;
			}

			t1.elem_x -= dx;
			t2.elem_x += dx;
			t1.elem_y -= dy;
			t2.elem_y += dy;

			t1.draw(false);
			t2.draw(false);

			t1.draw_elem();
			t2.draw_elem();

			setTimeout(swapAnimate, 50, f, t1, t2, c + 1);
		}

		swapAnimate(this, tile1, tile2);
	}

	this.click = function(x, y) {
		this.deactivate();

		var i = Math.floor((y - 2) / (consts.TileHeight + 2));
		var j = Math.floor((x - 2) / (consts.TileWidth + 2));

		if(Math.abs(i - this.active.i) == 0 && Math.abs(j - this.active.j) == 1
		 || Math.abs(j - this.active.j) == 0 && Math.abs(i - this.active.i) == 1) {
			this.swap(i, j, this.active.i, this.active.j);
			this.activate(-1, -1)
		} else {
			this.activate(i, j);
		}

		this.deleteCombos();
	}

	this.keypress = function(key) {
	}
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var f = new Field(10, 10);

function draw() {
	f.deleteCombos();
}

canvas.addEventListener('click', function(e) {
	f.click(e.layerX, e.layerY);
});

document.addEventListener('keydown', function(e) {
	f.keypress(e.key);
});