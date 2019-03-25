var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var f = new FieldGraphic(10, 10, 7, 'images/sprites.png', 'images/spriteBorderActive.png');
var frames = 0, timePassed = 0;
var WidthScale, HeightScale;
var redraw;


function onMouseDown(e) {
	f.mDown(new Point(e.offsetX / WidthScale, e.offsetY / HeightScale));
}

function onMouseUp(e) {
	f.mUp(new Point(e.offsetX / WidthScale, e.offsetY / HeightScale));
}

function onMouseMove(e) {
	f.mMove(new Point(e.offsetX / WidthScale, e.offsetY / HeightScale));
}

function onResize(e) {
	canvas.height = 0.8 * Math.min(window.innerHeight, window.innerWidth);
	canvas.width = canvas.height;

	WidthScale = canvas.width / 1040;
	HeightScale = canvas.height / 1040

	console.log("new scale", WidthScale, HeightScale);

	redraw = true;
}

function update(dt) {
	if(frames == 100) {
		timePassed *= 0.9;
		frames -= 10;
	}

	frames++;
	timePassed += dt;
	document.getElementById('fps-counter').innerHTML = Math.floor(frames / timePassed) + "fps";

	redraw = f.update(dt);
}

function render() {
	if(!redraw) return;

	ctx.save();
	ctx.scale(WidthScale, HeightScale);

    ctx.fillStyle = terrainPattern;
    ctx.clearRect(0, 0, 1040, 1040);
    ctx.fillRect(0, 0, 1040, 1040);

    document.getElementById('scores').innerHTML = "Scores: " + f.scores;

	f.render(ctx);
	ctx.restore();
}

var lastTime;
function main() {
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
	window.addEventListener("resize", onResize);
	// canvas.addEventListener("touchmove", e => { onMouseDown(e); onMouseMove(e)} , false);

    lastTime = Date.now();

    onResize(null);

    main();
}

resources.load([
	'images/sprites.png',
	'images/spriteBorderPassive.png',
	'images/spriteBorderActive.png'
]);
resources.onReady(init);