function FieldGraphic(m, n, max_rand, sp_file, sp_active, sp_size = consts.TileWidth) {
	this.field = new Field(m, n, max_rand);
	this.field.makeRandom()

	var active = false;
	

	this.mUp = function(p) {
		
	}

	this.mDown = function(p) {
		var i = Math.floor((p.y - 2) / (consts.TileWidth + 4)),
			j = Math.floor((p.x - 2) / (consts.TileHeight + 4));

		if(this.active && this.active.x == i && this.active.y == j) {
			this.active = false;
		} else {
			this.active = new Point(i, j);
		}

	}

	this.update = function(dt) {

	}

	this.render = function(ctx) {
		if(this.active)
			renderEntity(ctx, {
					pos: [this.active.y * (consts.TileWidth + 4), this.active.x * (consts.TileHeight + 4)],
					sprite: new Sprite(sp_active, [0, 0], [44, 44])
				});

		for(var i = 0; i < m; i++) {
			for(var j = 0; j < n; j++) {
				var f = this.field.elems[i][j];
				renderEntity(ctx, {
					pos: [2 + j * (consts.TileHeight + 4), 2 + i * (consts.TileWidth + 4)],
					sprite: new Sprite(sp_file, [40 * f, 0], [40, 40])
				})
			}
		}
	}
}