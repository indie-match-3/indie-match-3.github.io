function renderEntities(ctx, list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(ctx, list[i]);
    }    
}

function renderEntity(ctx, entity) {
    ctx.save();
    ctx.translate(entity.pos.x, entity.pos.y);
    entity.sprite ? entity.sprite.render(ctx) : false;
    ctx.restore();
}


function Point(x, y) {
	this.x = x;
	this.y = y;

	this.equal = function(p) {
		return p.x == this.x && p.y == this.y;
	}
}

function PointPair(p1, p2) {
	this.p1 = p1;
	this.p2 = p2;

	this.equal = function(pp) {
		return p1.equal(pp.p1) && p2.equal(pp.p2) || p2.equal(pp.p1) && p1.equal(pp.p2);
	}
}

function Combo() {
	this.points = [];

	this.getLast = function() {
		if(this.points.length > 0) {
			return this.points[this.points.length - 1];
		}
	}

	this.contains = function(point) {
		return this.points.some(p => p.equal(point));
	}

	this.intersects = function(combo) {
		return this.points.some(p => combo.contains(p));
	}

	this.merge = function(combo) {
		this.points = this.points.concat(combo.points.filter(p => !this.contains(p)));
	}
}

function distance(p1, p2) {
	return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function razn(p1, p2) {
	return move(p1, p2, -1);
}

function move(p, dp, k = 1) {
	return new Point(p.x + dp.x * k, p.y + dp.y * k);
}

function sign(p) {
	return new Point(Math.sign(p.x), Math.sign(p.y))
}

function inRange(a, b, p) {
	return ((a.x >= b.x && a.x >= p.x && p.x >= b.x) || (a.x <= b.x && a.x <= p.x && p.x <= b.x)) &&
		   ((a.y >= b.y && a.y >= p.y && p.y >= b.y) || (a.y <= b.y && a.y <= p.y && p.y <= b.y))
}