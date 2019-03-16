function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function Field(m, n, max_rand) {
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

	this.makeCustom = function() {
		this.elems = [
			[1, 1, 0],
			[2, 2, 1],
			[0, 0, 1],
		]
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
				if(buf.points.length == 0 || this.getElemBy(buf.getLast()) == this.elems[i][j] && this.elems[i][j] != -1) {
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
				if(buf.points.length == 0 || this.getElemBy(buf.getLast()) == this.elems[i][j] && this.elems[i][j] != -1) {
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
		for(var i = 0; i < c2.length; i++) {
			var merged = false;
			for(var j = 0; j < res.length; j++) {
				if(res[j].intersects(c2[i])) {
					res[j].merge(c2[i]);
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

	function checkPattern(p, pat, field) {
		if((p.x + pat.length) > n || (p.y + pat[0].length) > m) 
			return false;

		var elem = -1;

		for(var i = 0; i < pat.length; i++) {
			for(var j = 0; j < pat[i].length; j++) {
				if(pat[i][j] == 1 && (field[i + p.x][j + p.y] == elem || elem == -1)) {
					elem = field[i + p.x][j + p.y]
				} else if(pat[i][j] == 1) {
					return false;
				}
			}
		}

		return true;
	}

	this.getPotentials = function() {
		var res = [];

		for(var i = 0; i < m; i++) {
			for(var j = 0; j < n; j++) {
				for(var k = 0; k < PatternsList.length; k++) {
					var p = PatternsList[k];
					var curr = new Point(i, j);
					if(checkPattern(curr, p.pat, this.elems)) {
						res.push(new PointPair(move(p.points.p1, curr), move(p.points.p2, curr)))
					}
				}
			}
		}

		return res;
	}

	this.checkAction = function(potentials, pp) {
		return potentials.some(pot => pot.equal(pp));
	}
}