function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function Field(m, n, max_rand) {
	function Point(x, y) {
		this.x = x;
		this.y = y;
	}

	function Combo() {
		this.points = [];

		this.getLast = function() {
			if(this.points.length > 0) {
				return this.points[this.points.length - 1];
			}
		}

		this.contains = function(point) {
			return this.points.find(p => (p.x == point.x && p.y == point.y)) && true || false;
		}

		this.intersects = function(combo) {
			return this.points.some(p => combo.contains(p));
		}

		this.merge = function(combo) {
			this.points = this.points.concat(combo.points.filter(p => !this.contains(p)));
		}
	}

	this.elems = [];
	this.makeRandom = function() {
		this.elems = [];
		for(var i = 0; i < m; i++) {
			var row = []
			for(var j = 0; j < n; j++) {
				row.push(getRandomInt(max_rand))
			}
			this.elems.push(row);
		}

		if(this.containsRemovables()) {
			this.makeRandom();
		}
	}

	this.getElemBy = function(p) {
		return this.elems[p.x][p.y];
	}

	this.setElemBy = function(p, val) {
		this.elems[p.x][p.y] = val;
	}

	this.getRowCombos = function() {
		var res = []
		for(var i = 0; i < m; i++) {
			var buf = new Combo();
			for(var j = 0; j < n; j++) {
				if(buf.points.length == 0 || this.getElemBy(buf.getLast()) == this.elems[i][j]) {
					buf.points.push(new Point(i, j));
					continue;
				} else if(buf.points.length >= 3) {
					res.push(buf);
				}
				buf = new Combo();
				buf.points.push(new Point(i, j));
			}

			if(buf.points.length >= 3) {
				res.push(buf);
			}
		}

		return res;
	}

	this.getColCombos = function() {
		var res = []
		for(var j = 0; j < n; j++) {
			var buf = new Combo();
			for(var i = 0; i < m; i++) {
				if(buf.points.length == 0 || this.getElemBy(buf.getLast()) == this.elems[i][j]) {
					buf.points.push(new Point(i, j));
					continue;
				} else if(buf.points.length >= 3) {
					res.push(buf);
				}
				buf = new Combo();
				buf.points.push(new Point(i, j));
			}

			if(buf.points.length >= 3) {
				res.push(buf);
			}
		}

		return res;
	}

	this.merge = function(c1, c2) {
		if(!c1 || c1.length == 0) {
			return c2;
		} else if(!c2 || c2.length == 0) {
			return c1;
		}

		var res = c1;
		for(var i = 0; i < c2 ? c2.length : 0; i++) {
			var merged = false;
			for(var j = 0; j < res.length; j++) {
				if(res[j].intersects(c2[i])) {
					res[j] = res[j].merge(c2[i]);
					merged = true;
				}
			}

			if(!merged) res.push(c2[i]);
		}
		return res;
	}

	this.getRemovables = function() {
		return this.merge(this.getRowCombos(), this.getColCombos());
	}

	this.containsRemovables = function() {
		return this.getRemovables().length != 0;
	}
}