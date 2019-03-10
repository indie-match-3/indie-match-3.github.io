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
};

function init() {
    lastTime = Date.now();
    main();
}

resources.load([
	"images/sprites.png"
]);
resources.onReady(init);