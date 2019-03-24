function FieldGraphic(m, n, max_rand, sp_file, sp_active) {
	this.field = new Field(m, n, max_rand);
	this.field.makeRandom()
	// this.field.makeCustom()
	this.scores = 0;

	var active = false;
	var tasks = [];
	var fall_speed = 250;

	this.swap = function(p1, p2, backward = false) {
		var val1 = this.field.elems[p1.x][p1.y];
		var val2 = this.field.elems[p2.x][p2.y];

		var sp1 = new Sprite(sp_file, [40 * val1, 0], [40, 40]);
		var sp2 = new Sprite(sp_file, [40 * val2, 0], [40, 40]);

		var pots = this.field.getPotentials();
		this.field.elems[p1.x][p1.y] = -1;
		this.field.elems[p2.x][p2.y] = -1;

		var pxy1 = new Point(2 + p1.y * (consts.TileHeight + 4), 2 + p1.x * (consts.TileWidth + 4));
		var pxy2 = new Point(2 + p2.y * (consts.TileHeight + 4), 2 + p2.x * (consts.TileWidth + 4));

		var allowed = this.field.checkAction(pots, new PointPair(p2, p1)) || backward;
		console.log("swap allowed? " + allowed)
		console.log(new PointPair(p2, p1))
		console.log(pots)

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

			allowed: allowed,
			backward: backward,
		})
	}

	this.mUp = function(p) {	
		this.pressed = false;
	}

	this.mDown = function(p) {
		var i = Math.floor((p.y - 2) / (consts.TileWidth + 4)),
			j = Math.floor((p.x - 2) / (consts.TileHeight + 4));
		var curr = new Point(i, j);
		this.pressed = true;

		if(!this.active || this.active && distance(this.active, curr) > 1) {
			this.active = curr;		
		} else if(this.active && distance(this.active, curr) == 1) {
			this.swap(this.active, curr);
			this.active = false;
		}
	}

	this.mMove = function(p) {
		var i = Math.floor((p.y - 2) / (consts.TileWidth + 4)),
			j = Math.floor((p.x - 2) / (consts.TileHeight + 4));
		var curr = new Point(i, j);

		if(this.pressed && distance(this.active, curr) == 1) {
			this.swap(this.active, curr);
			this.active = false;
		}
	}

	function push_fall(p, val, count, _this) {
		var sp = new Sprite(sp_file, [40 * val, 0], [40, 40]);
		var pxy = new Point(2 + p.y * (consts.TileHeight + 4), 2 + p.x * (consts.TileWidth + 4));

		tasks.push({
			type: "fall",
			elem: {
				pos: pxy,
				start_pos: pxy,
				value: val,
				sprite: sp,
				to_point: move(pxy, new Point(0, consts.TileWidth), count),
				to_idx_point: new Point(p.x + count, p.y),
			}						
		})
	}

	this.fall = function() {
		for(var j = 0; j < n; j++) {
			var count = 0;
			for(var i = m - 1; i >= 0; i--) {
				if(this.field.elems[i][j] == -1) {
					count++;
					continue;
				}

				if(count > 0) {
					var val = this.field.elems[i][j];
					this.field.elems[i][j] = -1;
					push_fall(new Point(i, j), val, count, this);
				}
			}

			if(count > 0) {
				for(var i = count - 1; i >= 0; i--) {
					push_fall(new Point(i - count, j), getRandomInt(max_rand), count, this);
				}
			}
		}
	}

	this.update = function(dt) {
		if(tasks.length == 0) {
			this.removeCombos();
		}

		var res = (tasks.length != 0) || active;
		// var res = true;

		// console.log(active);

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

						this.removeCombos();
						tasks.splice(i, 1);

						if(!t.allowed && !t.backward) {
							this.swap(t.oth_elem.to_idx_point, t.elem.to_idx_point, true)
						}
					}
				}
				break
				case "fall": {
					var s1 = sign(razn(t.elem.to_point, t.elem.start_pos));

					t.elem.pos = move(t.elem.pos, s1, fall_speed * dt);

					if(!inRange(t.elem.start_pos, t.elem.to_point, t.elem.pos)) {
						t.elem.pos = t.elem.to_point;

						this.field.setElemBy(t.elem.to_idx_point, t.elem.value);

						tasks.splice(i, 1);
					}
				}
			}
		}

		return res;
	}

	this.removeCombos = function() {
		var cmbs = this.field.getRemovables();
		for(var i = 0; i < cmbs.length; i++) {
			for(var j = 0; j < cmbs[i].points.length; j++) {
				this.field.setElemBy(cmbs[i].points[j], -1);
			}
			this.scores = Math.floor(this.scores + cmbs[i].points.length * 100);
		}

		if(cmbs.length) {
			this.fall();
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
				break
				case "fall": {
					renderEntity(ctx, t.elem);
				}
			}
		}
	}
}