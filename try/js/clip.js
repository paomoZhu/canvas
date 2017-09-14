var rubberhandDiv = document.getElementById('rubberhandDiv'),
    resetButton = document.getElementById('resetButton'),
    image = new Image(),
    mousedown = {},
    rubberhandRectangle = {},
    dragging = false;

//Functions,,,,,,,,,,,,,,,,,,,

function rubberhandStart(x, y) {
    mousedown.x = x;
    mousedown.y = y;

    rubberhandRectangle.left = mousedown.x;
    rubberhandRectangle.top = mousedown.y;

    moveRubberhandDiv();
    showRubberhandDiv();

    dragging = true;
}

function rubberhandStretch(x, y) {

    rubberhandRectangle.left = x < mousedown.x ? x: mousedown.x;
    rubberhandRectangle.top = y < mousedown.y ? y: mousedown.y;

    rubberhandRectangle.width = Math.abs(x - mousedown.x);
    rubberhandRectangle.height = Math.abs(y - mousedown.y);

    moveRubberhandDiv();
    resizeRubberhandDiv();

}

function rubberhandEnd() {
    var box = canvas.getBoundingClientRect();

    try {
        context.drawImage(canvas,
        rubberhandRectangle.left - box.left,
        rubberhandRectangle.top - box.top,
        rubberhandRectangle.width,
        rubberhandRectangle.height,
        0, 0, canvas.width, canvas.height);
    }catch (e){
        //outside the canvas
    }

    resetRubberhandRectangle();

    rubberhandDiv.style.width = 0;
    rubberhandDiv.style.height = 0;

    hideRubberhandDiv();

    dragging = false;
}

function moveRubberhandDiv() {

    rubberhandDiv.style.top = rubberhandRectangle.top + 'px';
    rubberhandDiv.style.left = rubberhandRectangle.left + 'px';

}

function resizeRubberhandDiv() {

    rubberhandDiv.style.width = rubberhandRectangle.width + 'px';
    rubberhandDiv.style.height = rubberhandRectangle.height + 'px';

}

function showRubberhandDiv() {

    rubberhandDiv.style.display = 'inline';

}

function hideRubberhandDiv() {

    rubberhandDiv.style.display = 'none';

}

function resetRubberhandRectangle() {

    rubberhandRectangle = {
        top: 0,
        left: 0,
        width: 0,
        height: 0
    };

}

//Event handles

canvas.onmousedown = function (e) {

    var x = e.clientX,
        y = e.clientY;

    e.preventDefault();

    rubberhandStart(x, y);

};

window.onmousemove = function (e) {

    var x = e.clientX,
        y = e.clientY;

    e.preventDefault();

    if(dragging){
        rubberhandStretch(x, y);
    }

};

window.onmouseup = function (e) {

    e.preventDefault();
    rubberhandEnd();

};

image.onload = function () {

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

};

resetButton.onclick = function (e) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
};

// initialzation

image.src = 'image/scene.jpg';






