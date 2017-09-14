//Functions

function drawGrid(context, color, stepX, stepY) {

    context.strokeStyle = color;
    context.lineWidth = 0.5;

    for (var i = stepX + 0.5; i< context.canvas.width; i += stepX){
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, context.canvas.height);
        context.stroke();
    }

    for(var i = stepY + 0.5; i< context.canvas.height; i += stepY){
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
    }

}

function drawTwoArcs() {

    context.beginPath();
    context.arc(250, 250, 150, 0, Math.PI*2, false);

    context.arc(250, 250, 100, 0, Math.PI*2, true);

    context.fill();
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.beginPath(); //  清除子路径终点到起点的线
    context.stroke();

}

function draw() {

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(context, 'lightgray', 10, 10);

    context.save();

    context.shadowColor = 'rgba(0, 0, 0, 0.8)';
    context.shadowOffsetX = 12;
    context.shadowOffsetY = 12;
    context.shadowBlur = 15;

    drawTwoArcs();

    context.restore();

}

//initialization

context.fillStyle = 'rgba(100, 140, 230, 0.5)'
context.strokeStyle = context.fillStyle;
draw();