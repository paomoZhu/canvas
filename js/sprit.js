var readout = document.getElementById('readout'),
    spritesheet = new Image();

//Functions ....................................

function windowToCanvas(canvas, x, y) {
    var box = canvas.getBoundingClientRect();
    return {
        x: x - box.left * (canvas.width / box.width),
        y: y - box.top * (canvas.height / box.height)
    };
}

function drawBackground() {

    var vertical_line_spacing = 12,
        i = context.canvas.height;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'lightgray';
    context.lineWidth = 0.5;

    while(i > vertical_line_spacing*4 ){
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
        i -= vertical_line_spacing;
    }

}

function drawSpritesheet() {

    context.drawImage(spritesheet, 0 , 0);

}

function drawGuidelines(x, y) {

    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'rgba(0, 0, 230, 0.8)';
    context.lineWidth = .5;
    drawVerticalLine(x);
    drawHorizontalLine(y);

}

function updateReadout(x, y) {

    readout.innerText = '(' + x.toFixed(0) + ',' + y.toFixed(0) + ')';

}

function drawHorizontalLine(y) {

    context.beginPath();
    context.moveTo(0, y+0.5);
    context.lineTo(context.canvas.width, y+0.5);
    context.stroke();

}

function drawVerticalLine(x) {

    context.beginPath();
    context.moveTo(x + 0.5, 0);
    context.lineTo(x + 0.5, context.canvas.height);
    context.stroke();

}

//event handlers
canvas.onmousemove = function (e) {

    var loc = windowToCanvas(canvas, e.clientX, e.clientY);

    drawBackground();
    drawSpritesheet();
    drawGuidelines(loc.x, loc.y);
    updateReadout(loc.x, loc.y);

};

//initialization

spritesheet.src = 'image/cjml.png';
spritesheet.onload = function (e) {

    drawSpritesheet();

};

drawBackground();
