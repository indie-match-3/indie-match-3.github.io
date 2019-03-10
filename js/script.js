var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var f = new Field(10, 10);

function handleMouse(dt) {

}

function update(dt) {
	handleMouse(dt);
	f.update(dt);
}

function render() {
    // ctx.fillStyle = terrainPattern;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
	// terrainPattern = ctx.createPattern(resources.get('images/spriteBorder.png'), 'repeat');

    lastTime = Date.now();
    main();
}

resources.load([
	'images/sprites.png',
	'images/spriteBorder.png'
]);
resources.onReady(init);