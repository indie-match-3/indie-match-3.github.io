function FieldGraphic(m, n, max_rand, sp_file, sp_size = consts.TileWidth) {
	this.field = new Field(m, n, max_rand);
	this.field.makeRandom()

	// console.log(field);

	this.update = function(dt) {

	}

	this.render = function(ctx) {
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