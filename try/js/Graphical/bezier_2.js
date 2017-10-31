var arrow_margin  =  30,
    point_radius  =  7,
    points = [
        {
            x: canvas.width - arrow_margin,
            y: canvas.height - arrow_margin
        },
        {
            x: canvas.width - arrow_margin*2,
            y: canvas.height - arrow_margin
        },
        {
            x: point_radius,
            y: canvas.height/2
        },
        {
            x: arrow_margin,
            y: canvas.height/2 - arrow_margin
        },
        {
            x: canvas.width - arrow_margin,
            y: arrow_margin
        },
        {
            x: canvas.width - arrow_margin,
            y: arrow_margin*2
        }
    ];

// Functions

function drawPoint(x, y, strokeStyle, fillStyle) {

    context.beginPath();
    context.fillStyle   =   fillStyle;
    context.strokeStyle =   strokeStyle;
    context.lineWidth   =   0.5;
    context.arc(x, y, point_radius, 0, Math.PI*2, false);
    context.fill();
    context.stroke();
}

function drawBezierPoints() {

    var i,
        strokeStyle,
        fillStyle;

    for( i=0 ; i<points.length; ++i){
        fillStyle   = i%2 === 0?'white':'blue',
        strokeStyle = i%2 === 0?'blue':'white';
        drawPoint(points[i].x, points[i].y, strokeStyle, fillStyle);
    }

}

function drawArrow() {

    context.strokeStyle   =   'white';
    context.fillStyle     =   'cornflowerblue';

    context.moveTo(canvas.width - arrow_margin, arrow_margin*2);
    context.lineTo(canvas.width - arrow_margin, canvas.height - arrow_margin*2);
    context.quadraticCurveTo(points[0].x, points[0].y, points[1].x, points[1].y);

    context.lineTo(arrow_margin, canvas.height/2 + arrow_margin);
    context.quadraticCurveTo(points[2].x, points[2].y, points[3].x, points[3].y);

    context.lineTo(canvas.width - arrow_margin*2, arrow_margin);
    context.quadraticCurveTo(points[4].x, points[4].y, points[5].x, points[5].y);

    context.fill();
    context.stroke();
}

//initialization

context.clearRect(0, 0, canvas.width, canvas.height);
drawArrow();
drawBezierPoints();