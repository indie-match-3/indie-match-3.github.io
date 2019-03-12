var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var f = new FieldGraphic(10, 10, 6, 'images/sprites.png');

function onMouseDown(e) {
	// f.mDown([e.layerX, e.layerY]);
	// console.log(e);
}

function onMouseUp(e) {
	// f.mUp([e.layerX, e.layerY]);
	// console.log(e);
}

function update(dt) {
	f.update(dt);
}

function render() {
    ctx.fillStyle = terrainPattern;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

	f.render(ctx);
}

var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimationFrame(main);
}

var terrainPattern;
function init() {
	terrainPattern = ctx.createPattern(resources.get('images/spriteBorderPassive.png'), 'repeat');

	canvas.addEventListener("mousedown", onMouseDown, false);
	canvas.addEventListener("mouseup", onMouseUp, false);

    lastTime = Date.now();
	

    main();
}

resources.load([
	'images/sprites.png',
	'images/spriteBorderPassive.png',
	'images/spriteBorderActive.png'
]);
resources.onReady(init);