function FieldGraphic(m, n, max_rand, sp_file, sp_active) {
	this.field = new Field(m, n, max_rand);
	this.field.makeRandom()

	var active = false;
	var tasks = [];
	var fall_speed = 10;

	function distance(p1, p2) {
		return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
	}

	function razn(p1, p2) {
		return move(p1, p2, -1);
	}

	function move(p, dp, k) {
		return new Point(p.x + dp.x * k, p.y + dp.y * k);
	}

	function sign(p) {
		return new Point(Math.sign(p.x), Math.sign(p.y))
	}

	function inRange(a, b, p) {
		return ((a.x >= b.x && a.x >= p.x && p.x >= b.x) || (a.x <= b.x && a.x <= p.x && p.x <= b.x)) &&
			   ((a.y >= b.y && a.y >= p.y && p.y >= b.y) || (a.y <= b.y && a.y <= p.y && p.y <= b.y))
	}

	this.swap = function(p1, p2) {
		var val1 = this.field.elems[p1.x][p1.y];
		var val2 = this.field.elems[p2.x][p2.y];

		var sp1 = new Sprite(sp_file, [40 * val1, 0], [40, 40]);
		var sp2 = new Sprite(sp_file, [40 * val2, 0], [40, 40]);

		this.field.elems[p1.x][p1.y] = -1;
		this.field.elems[p2.x][p2.y] = -1;

		var pxy1 = new Point(2 + p1.y * (consts.TileHeight + 4), 2 + p1.x * (consts.TileWidth + 4));
		var pxy2 = new Point(2 + p2.y * (consts.TileHeight + 4), 2 + p2.x * (consts.TileWidth + 4));

		tasks.push({
			type: "swap",
			elem: {
				pos: pxy1,
				start_pos: pxy1,
				value: val1,
				sprite: sp1,
				to_point: pxy2,
				to_idx_point: p2,
			},

			oth_elem: {
				pos: pxy2,
				start_pos: pxy2,
				value: val2,
				sprite: sp2,
				to_point: pxy1,
				to_idx_point: p1,
			},
		})
	}

	this.mUp = function(p) {	
		var i = Math.floor((p.y - 2) / (consts.TileWidth + 4)),
			j = Math.floor((p.x - 2) / (consts.TileHeight + 4));
		
		if(this.active && this.active.x == i && this.active.y == j) {
			this.active = false;
		} else if(this.active && distance(this.active, new Point(i, j)) == 1) {
			this.swap(this.active, new Point(i, j));
			this.active = false;
		}else {
			this.active = new Point(i, j);			
		}
	}

	this.mDown = function(p) {
	}

	this.update = function(dt) {
		for(var i = 0; i < tasks.length; i++) {
			var t = tasks[i];

			switch(t.type) {
				case "swap": {
					var s1 = sign(razn(t.elem.to_point, t.elem.start_pos));
					var s2 = sign(razn(t.oth_elem.to_point, t.oth_elem.start_pos));

					t.elem.pos = move(t.elem.pos, s1, fall_speed * dt);
					t.oth_elem.pos = move(t.oth_elem.pos, s2, fall_speed * dt);

					if(!inRange(t.elem.start_pos, t.elem.to_point, t.elem.pos) && 
						!inRange(t.oth_elem.start_pos, t.oth_elem.to_point, t.oth_elem.pos)) {
						t.elem.pos = t.elem.to_point;
						t.oth_elem.pos = t.oth_elem.to_point;

						this.field.setElemBy(t.elem.to_idx_point, t.elem.value);
						this.field.setElemBy(t.oth_elem.to_idx_point, t.oth_elem.value);

						tasks.splice(i, 1);
					}
				}
			}
		}
	}

	this.render = function(ctx) {
		if(this.active) {
			renderEntity(ctx, {
					pos: new Point(this.active.y * (consts.TileWidth + 4), this.active.x * (consts.TileHeight + 4)),
					sprite: new Sprite(sp_active, [0, 0], [44, 44])
				});
		}

		for(var i = 0; i < m; i++) {
			for(var j = 0; j < n; j++) {
				var f = this.field.elems[i][j];
				if(f != -1) {
					renderEntity(ctx, {
						pos: new Point(2 + j * (consts.TileHeight + 4), 2 + i * (consts.TileWidth + 4)),
						sprite: new Sprite(sp_file, [40 * f, 0], [40, 40])
					})
				}
			}
		}

		for(var i = 0; i < tasks.length; i++) {
			var t = tasks[i];

			switch(t.type) {
				case "swap": {
					renderEntity(ctx, t.elem);
					renderEntity(ctx, t.oth_elem);
				}
			}
		}
	}
}