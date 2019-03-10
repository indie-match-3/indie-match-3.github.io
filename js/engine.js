
ctx.scale(consts.WidthScale, consts.HeightScale);

function Sprite(path) {
	this.path = path

	this.equal = function(oth) {
		return this.color == oth.color;
	}
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

	this.isEmpty = function() {
		return !this.elem;
	}

	this.reset_elem = function() {
		this.elem_x = this.x;
		this.elem_y = this.y;		
	}

	this.reset_elem();

	this.draw_elem = function() {
		if(this.elem)
			this.elem.draw(this.elem_x, this.elem_y);
	}

	this.draw = function(with_elem = true) {
    	ctx.clearRect(this.x, this.y, consts.TileWidth, consts.TileHeight);
    	ctx.strokeStyle = (this.active ? "red" : "gray");
    	ctx.lineWidth = 2;
    	ctx.strokeRect(this.x, this.y, consts.TileWidth, consts.TileHeight);

    	if(with_elem)
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

var f = new Field(10, 10);

function draw() {
	f.deleteCombos();
}

canvas.addEventListener('click', function(e) {
	f.click(e.layerX / consts.WidthScale, e.layerY / consts.HeightScale);
});

document.addEventListener('keydown', function(e) {
	f.keypress(e.key);
});

draw();