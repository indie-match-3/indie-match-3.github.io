var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function update(timeDelta) {

}

function render() {

}

var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function init() {
    lastTime = Date.now();
    main();
}

resources.load([
    // 'img/sprites.png',
    // 'img/terrain.png'
]);
resources.onReady(init);