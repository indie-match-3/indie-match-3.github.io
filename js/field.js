function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function delta(pos1, pos2) {
	return [pos2[0] - pos1[0], pos2[1] - pos1[1]]
}

function distance(pos1, pos2) {
	return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
}

function move(pos, dpos, k = 1) {
	return [pos[0] + dpos[0] * k, pos[1] + dpos[1] * k];
}

function isOutOfBound(pos, dpos, dest) {
	return (dpos[0] < 0 && pos[0] <= dest[0]) || (dpos[0] > 0 && pos[0] >= dest[0]) ||
		   (dpos[1] < 0 && pos[1] <= dest[1]) || (dpos[1] > 0 && pos[1] >= dest[1]);
}

function Field(m, n) {
	this.tiles = []
	this.swaps = null;
	this.swap_time;
	
	for(var i = 0; i < m; i++) {
		for(var j = 0; j < n; j++) {
			var idx = getRandomInt(6);

			this.tiles.push({
				pos: [2 + j * (consts.TileHeight + 4), 2 + i * (consts.TileWidth + 4)],
				sprite: new Sprite("images/sprites.png", [40 * idx, 0], [40, 40])
			})
		}
	}

	this.posToIdx = function(pos) {
		return pos[0] * m + pos[1] 
	}


	this.render = function(ctx) {
		renderEntities(ctx, this.tiles);
	}

	this.swap = function(pos1, pos2) {
		if(distance(pos1, pos2) == 1 && !this.swaps) {
			console.log(pos1, pos2);

			var t1 = this.tiles[this.posToIdx(pos1)], t2 = this.tiles[this.posToIdx(pos2)];

			this.swaps = {
				p1: pos1,
				p2: pos2,

				d1: delta(t1.pos, t2.pos),
				d2: delta(t2.pos, t1.pos),

				dest1: t2.pos,
				dest2: t1.pos,

				speed: 5,
			}

			console.log(this.swaps);
		}
	}

	this.update = function(dt) {
		if(this.swaps) {
			var i1 = this.posToIdx(this.swaps.p1),
				i2 = this.posToIdx(this.swaps.p2),
				tile1 = this.tiles[i1],
				tile2 = this.tiles[i2];

			tile1.pos = move(tile1.pos, this.swaps.d1, dt * this.swaps.speed);
			tile2.pos = move(tile2.pos, this.swaps.d2, dt * this.swaps.speed);

			if(isOutOfBound(tile1.pos, this.swaps.d1, this.swaps.dest1) &&
			   isOutOfBound(tile2.pos, this.swaps.d2, this.swaps.dest2)) {
				tile1.pos = this.swaps.dest1;
				tile2.pos = this.swaps.dest2;

				[tile1, tile2] = [tile2, tile1];
				this.swaps = null;
			}
		}
	}
}
