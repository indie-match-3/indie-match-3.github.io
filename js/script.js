var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var f = new FieldGraphic(10, 10, 7, 'images/sprites.png', 'images/spriteBorderActive.png');
var frames = 0, timePassed = 0;
var redraw = true;

function onMouseDown(e) {
	f.mDown(new Point(e.offsetX / consts.WidthScale(canvas.width), e.offsetY / consts.HeightScale(canvas.height)));
}

function onMouseUp(e) {
	f.mUp(new Point(e.offsetX / consts.WidthScale(canvas.width), e.offsetY / consts.HeightScale(canvas.height)));
}

function onMouseMove(e) {
	f.mMove(new Point(e.offsetX / consts.WidthScale(canvas.width), e.offsetY / consts.HeightScale(canvas.height)));
}

function update(dt) {
	if(frames == 100) {
		timePassed *= 0.9;
		frames -= 10;
	}

	frames++;
	timePassed += dt;
	document.getElementById('fps-counter').innerHTML = Math.floor(frames / timePassed) + "fps";

	f.update(dt);
}

function render() {
	if(!redraw) return;

	ctx.save();
	ctx.scale(consts.WidthScale(canvas.width), consts.HeightScale(canvas.height));

    ctx.fillStyle = terrainPattern;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.getElementById('scores').innerHTML = "Scores: " + f.scores;

	f.render(ctx);
	ctx.restore();
}

var lastTime;
function main() {
	canvas.height = 0.6 * window.innerHeight;
	canvas.width = canvas.height;

    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    render();
    update(dt);

    lastTime = now;
    requestAnimationFrame(main);
}

var terrainPattern;
function init() {
	terrainPattern = ctx.createPattern(resources.get('images/spriteBorderPassive.png'), 'repeat');

	canvas.addEventListener("mousedown", onMouseDown, false);
	canvas.addEventListener("mouseup", onMouseUp, false);
	canvas.addEventListener("mousemove", onMouseMove, false);
	// canvas.addEventListener("touchmove", e => { onMouseDown(e); onMouseMove(e)} , false);

    lastTime = Date.now();

    main();
}

resources.load([
	'images/sprites.png',
	'images/spriteBorderPassive.png',
	'images/spriteBorderActive.png'
]);
resources.onReady(init);