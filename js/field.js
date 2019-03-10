function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function Field(m, n) {
	this.tiles = []
	
	for(var i = 0; i < m; i++) {
		for(var j = 0; j < n; j++) {
			var idx = getRandomInt(6);

			this.tiles.push({
				pos: [2 + j * (consts.TileHeight + 4), 2 + i * (consts.TileWidth + 4)],
				sprite: new Sprite("images/sprites.png", [40 * idx, 0], [40, 40])
			})
		}
	}


	this.render = function(ctx) {
		renderEntities(ctx, this.tiles);
	}

	this.update = function(dt) {

	}
}
