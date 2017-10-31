var eraseAllButton           = query('eraseAllButton'),
strokeStyleSelect        = query('strokeStyleSelect'),
guidewireCheckbox        = query('guidewireCheckbox'),
instructions             = query('instructions'),
instructionsOkayButton   = query('instructionsOkayButton'),
instructionsNoMoreButton = query('instructionsNoMoreButton'),

showInstructions = true,

axis_margin             = 40,
horizontal_tick_spacing = 10,
vertical_tick_spacing   = 10,
tick_size               = 10,

axis_orgin  = {x: axis_margin, y: canvas.height - axis_margin},
axis_top    = axis_margin,
axis_right  = canvas.width - axis_margin,
axis_width  = axis_right - axis_orgin.x,
axis_height = axis_orgin.y - axis_top,

num_vertical_ticks    = axis_height / vertical_tick_spacing,
num_horizaontal_ticks = axis_width / horizontal_tick_spacing,

grid_stroke_style = 'lightblue',
grid_spacing      = 10,

control_point_radius       = 5,
control_point_stroke_style = 'blue',
control_point_fill_style   = 'rgba(255, 255, 0, 0.5)',

end_point_stroke_style = 'navy',
end_point_fill_style   = 'rgba(0, 255, 0, 0.5)',

guidewire_stroke_style = 'rgba(0, 0, 230, 0.4)',

drawingImageData,
mousedown      = {},
rubberbandRect = {},

dragging       = false,
draggingPoint  = false,

endPoints      = [{}, {}],
controlPoints  = [{}, {}],
editing        = false,

guidewires     = guidewireCheckbox.checked;

//Functions

function windowToCanvas(x, y) {

    var bbox = canvas.getBoundingClientRect();

    return {
        x: (x - bbox.left) * (canvas.width / bbox.width),
        y: (y - bbox.top) * (canvas.height/ bbox.height)
    };

}

//save and resotre drawing suiface

function saveDrawingSuiface() {

    drawingImageData = context.getImageData(0, 0, canvas.width, canvas.height);

}

function restoreDrawingSuiface() {
    context.putImageData(drawingImageData, 0, 0);
}

//Rubber bands
function updateRubberbandRectangle(loc) {

    rubberbandRect.width  = Math.abs(loc.x - mousedown.x);
    rubberbandRect.height = Math.abs(loc.y - mousedown.y);

    if(loc.x > mousedown.x) {
        rubberbandRect.left = mousedown.x;
    }else{
        rubberbandRect.left = loc.x;
    }

    if(loc.y > mousedown.y) {
        rubberbandRect.top = mousedown.y;
    }else{
        rubberbandRect.top = loc.y;
    }

}

function drawBezierCurve() {

    context.beginPath();
    context.moveTo(endPoints[0].x, endPoints[0].y);
    context.bezierCurveTo(controlPoints[0].x, controlPoints[0].y, controlPoints[1].x, controlPoints[1].y, endPoints[0].x, endPoints[0].y);
    context.stroke();

}

function updateEndAndControlPoints() {

    endPoints[0].x = rubberbandRect.left;
    endPoints[0].y = rubberbandRect.top;

    endPoints[1].x = rubberbandRect.left + rubberbandRect.width;
    endPoints[1].y = rubberbandRect.top + rubberbandRect.height;

    controlPoints[0].x = rubberbandRect.left;
    controlPoints[0].y = rubberbandRect.top + rubberbandRect.height;

    controlPoints[1].x = rubberbandRect.left + rubberbandRect.width;
    controlPoints[1].y = rubberbandRect.top;

}

function drawRubberbandShape(loc) {

    updateEndAndControlPoints();
    drawBezierCurve();

}

//Endpoints and control points...

function drawControlPoint(index) {

    context.beginPath();
    context.arc(controlPoints[index].x, controlPoints[index].y, control_point_radius, o, Math.PI*2, false);
    context.stroke();
    context.fill();

}

function drawControlPoints() {

    context.save();
    context.strokeStyle = control_point_stroke_style;
    context.fillStyle   = control_point_fill_style;
    drawControlPoint(0);
    drawControlPoint(1);
    context.stroke();
    context.fill();
    context.restore();

}

function drawEndPoint(index) {

    context.beginPath();
    context.arc(endPoints[index].x, endPoints[index].y, control_point_radius, 0, Math.PI*2, false);
    context.stroke();
    context.fill();

}

function drawEndPoints() {
    context.save();
    context.strokeStyle = end_point_stroke_style;
    context.fillStyle   = end_point_fill_style;
    drawEndPoint(0);
    drawEndPoint(1);
    context.stroke();
    context.fill();
    context.restore();
}

function drawControlAndEndPoints() {
    drawControlPoints();
    drawEndPoints();

}

function cursorInEndPoint(loc) {

    var pt;

    endPoints.forEach(function (point) {
        context.beginPath();
        context.arc(point.x, point.y, control_point_radius, 0, Math.PI*2, false);
        if(context.isPointInPath(loc.x, loc.y)){
            pt = point;
        }
    })

    return pt;

}

function cursorInControlPoint(loc) {

    var pt ;

    controlPoints.forEach(function(point){
        context.beginPath();
        context.arc(point.x, point.y, control_point_radius, 0, Math.PI*2, false);

        if(context.isPointInPath(loc.x, loc.y)){
            pt = point;
        }
    })

    return pt;

}

function updateDraggingPoint(loc) {

    draggingPoint.x = loc.x;
    draggingPoint.y = loc.y;

}

//canvas event handlers
canvas.onmousedown =function (e) {

    var loc = windowToCanvas(e.clientX, e.clientY);

    e.preventDefault();

    if(!editing){
        saveDrawingSuiface();
        mousedown.x = loc.x;
        mousedown.y = loc.y;
        updateRubberbandRectangle(loc);
        dragging = true;
    }else{
        draggingPoint = cursorInControlPoint(loc);

        if(!draggingPoint){
            draggingPoint = cursorInEndPoint(loc);
        }
    }

};

canvas.onmouse = function (e) {

    var loc = windowToCanvas(e.clientX, e.clientY);

    if(dragging || draggingPoint){
        e.preventDefault();
        restoreDrawingSuiface();

        if(guidewires){
            drawGuidewires(loc.x , loc.y);
        }
    }

    if(dragging){
        updateRubberband(loc);
        drawControlAndEndPoints();
    }else if(draggingPoint){
        updateDraggingPoint(loc);
        drawControlAndEndPoints();
        drawBezierCurve();
    }
};

canvas.onmouseup = function (e) {

    var loc = windowToCanvas(e.clientX, e.clientY);

    restoreDrawingSuiface();

    if(!editing){
        updateRubberband();
        drawControlAndEndPoints();
        dragging = false;
        editing  = true;
        if(showInstructions){
            instructions.display = 'inline';
        }
    }else{
        if(draggingPoint){
            drawControlAndEndPoints();
        }else{
            editing = false;
        }

        drawBezierCurve();
        draggingPoint = undefined;
    }

};

//Control event handlers....

eraseAllButton.onclick = function (e) {

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(grid_stroke_style, grid_spacing, grid_spacing);

    saveDrawingSuiface();

    editing =false;
    dragging = false;
    draggingPoint = undefined;

};

strokeStyleSelect.onchange = function (e) {

    context.strokeStyle = strokeStyleSelect.value;

};

guidewireCheckbox.onchange = function (e) {

    guidewires = guidewireCheckbox.checked;

}

//instructions event handlers

instructionsOkayButton.onclick = function (e) {

    instructions.style.display = 'none';

}

instructionsNoMoreButton.onclick = function (e) {

    instructions.style.display = 'none';
    showInstructions = false;

}

//initialization

context.strokeStyle = strokeStyleSelect.value;
drawGrid(grid_stroke_style, grid_spacing, grid_spacing);









