
var centroid_radius = 10,
    centroid_stroke_style = 'rgba(0,0,0,0.5',
    centroid_fill_style = 'rgba(80,190,240,0.6)',

    ring_inner_radius = 35,
    ring_outer_radius = 55,

    annotations_fill_style = 'rgba(0,0,230,0.9)',
    annotations_text_size = 12,

    tick_width = 10,
    tick_long_stroke_style = 'rgba(100,140,230,0.9)',
    tick_short_stroke_style = 'rgba(100,140,230,0.7)',

    tracking_dial_strokeing_style = 'rgba(100,140,230,0.5)',

    guidewire_stroke_style = 'goldenrod',
    guidewire_fill_style = 'rgba(250,250,0,0.6)',

    circle = {
        x: canvas.width/2,
        y: canvas.height/2,
        radius: 150
    };

function drawGrid(color, stepX, stepY) {

    context.save();
    context.shadowColor = undefined;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.strokeStyle = color;
    context.fillStyle = '#ffffff';
    context.lineWidth = 0.5;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for(var i = stepX; i< context.canvas.width; i+=stepX){
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, context.canvas.height);
        context.stroke();
    }

    for(var i= stepY; i<context.canvas.height; i+=stepY){
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
    }
    context.restore();
}

function drawDial() {

    var loc = {
        x: circle.x,
        y: circle.y
    };

    drawCentroid();
    drawCentroidGuidewire(loc);
    drawRing();
    drawTickInnerCircle();
    drawTicks();
    drawAnnotations();

}

function drawCentroid() {

    context.beginPath();
    context.save();
    context.strokeStyle = centroid_stroke_style;
    context.fillStyle = centroid_fill_style;
    context.arc(circle.x, circle.y, centroid_radius, 0, Math.PI*2, false);
    context.stroke();
    context.fill();
    context.restore();

}

function drawCentroidGuidewire(loc) {

    var angle = Math.PI/4*3,
        radius, endpt;

    radius = circle.radius + ring_outer_radius;

    if(loc.x >= circle.x){
        endpt = {
            x: circle.x + radius * Math.cos(angle),
            y: circle.y + radius * Math.sin(angle)
        }
    }else{
        endpt = {
            x: circle.x - radius * Math.cos(angle),
            y: circle.y - radius * Math.sin(angle)
        }
    }

    context.save();

    context.strokeStyle = guidewire_stroke_style;
    context.fillStyle = guidewire_fill_style;

    context.beginPath();
    context.moveTo(circle.x, circle.y);
    context.lineTo(endpt.x, endpt.y);
    context.stroke();

    context.beginPath();

    context.strokeStyle = tick_long_stroke_style;
    context.arc(endpt.x, endpt.y, 5, 0, Math.PI*2, false);
    context.fill();
    context.stroke();

    context.restore();

}

function drawRing() {

    drawRingOuterCircle();

    context.strokeStyle = 'rgba(0,0,0,0.1)';
    context.arc(circle.x, circle.y, circle.radius + ring_inner_radius, 0, Math.PI*2, false);

    context.fillStyle = 'rgba(100,140,230,0.1)';
    context.fill();
    context.stroke();

}

function drawRingOuterCircle() {

    context.shadowColor = 'rgba(0,0,0,0.7)';
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;
    context.shadowBlur= 6;
    context.strokeStyle = tracking_dial_strokeing_style;
    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius + ring_outer_radius, 0, Math.PI*2, true);
    context.stroke();

}

function drawTickInnerCircle() {

    context.save();
    context.beginPath();
    context.strokeStyle = 'rgba(0,0,0,0.1)';
    context.arc(circle.x, circle.y, circle.radius + ring_inner_radius - tick_width, 0, Math.PI*2, false);
    context.stroke();
    context.restore();

}

function drawTick(angle, radius, cnt) {

    var tickWidth = cnt % 8 === 0 ? tick_width : tick_width/2;

    context.beginPath();
    context.moveTo(circle.x + Math.cos(angle) * (radius - tickWidth),
                   circle.y + Math.sin(angle) * (radius - tickWidth));

    context.lineTo(circle.x + Math.cos(angle) * (radius),
                   circle.y + Math.sin(angle) * (radius));

    context.strokeStyle = tick_short_stroke_style;
    context.stroke();
}

function drawTicks() {

    var radius = circle.radius + ring_inner_radius,
        angle_max = 2*Math.PI,
        angle_delta = Math.PI/64,
        tickWidth;

    context.save();

    for(var angle = 0, cnt = 0; angle<angle_max; angle += angle_delta, cnt++){
        drawTick(angle, radius, cnt++);
    }

    context.restore();

}

function drawAnnotations() {

    var radius = circle.radius + ring_inner_radius;

    context.save();
    context.fillStyle = annotations_fill_style;
    context.font = annotations_text_size + 'px Helvetica';

    for(var angle=0; angle< 2*Math.PI; angle+=Math.PI/8){
        context.beginPath();
        context.fillText((angle * 180/Math.PI).toFixed(0), circle.x + Math.cos(angle)*(radius - tick_width*2), circle.y - Math.sin(angle)*(radius - tick_width*2));
    }

    context.restore();

}

//initialzation

context.shadowColor = 'rgba(0,0,0,0.4)';
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4;

context.textAlign = 'center';
context.textBaseline = 'middle';

drawGrid('lightgray', 10, 10);
drawDial();