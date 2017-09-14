var font_height = 15,
    margin = 35,
    hand_truncation = canvas.width/25,
    minute_hand_truncation = canvas.width/15,
    hour_hand_truncation = canvas.width/10,
    numeral_spacing = 20,
    radius = canvas.width/2 - margin,
    hand_radius = radius + numeral_spacing;

function drawCircle(){
    context.beginPath();
    context.arc(canvas.width/2, canvas.height/2, radius, 0, Math.PI*2, true);
    context.stroke();
}

function drawNumberals() {
    
    var numerals = [1,2,3,4,5,6,7,8,9,10,11,12],
        angle = 0,
        numeralWidth = 0;
    
    numerals.forEach(function (numeral) {
        angle = Math.PI/6 * (numeral - 3);
        numeralWidth = context.measureText(numeral).width;
        context.fillText(numeral,
                         canvas.width/2 +  Math.cos(angle) * (hand_radius) - numeralWidth/2,
                         canvas.height/2 + Math.sin(angle) * (hand_radius) - font_height/3);
    });
}
function drawCenter() {
    context.beginPath();
    context.arc(canvas.width/2, canvas.height/2, 5, 0, Math.PI*2, true);
    context.fill();
}

function drawHand(loc, type){
    var angle = (Math.PI*2) * (loc/60) - Math.PI/2,
    handRadius;

    switch (type){
        case 'hour':
            handRadius = radius - hand_truncation - hour_hand_truncation - minute_hand_truncation;
            break;
        case 'minute':
            handRadius = radius - hand_truncation - minute_hand_truncation;
            break;
        case 'second':
            handRadius = radius - hand_truncation;
            break;
    }


    context.moveTo(canvas.width/2, canvas.height/2);
    context.lineTo(canvas.width/2 + Math.cos(angle)*handRadius,
                   canvas.height/2 + Math.sin(angle)*handRadius);

    context.stroke();
}

function drawHands(){
    var date = new Date,
        hour = date.getHours();

    hour = hour > 12 ? hour - 12 : hour;

    drawHand(hour * 5 + (date.getMinutes()/60)*5, 'hour');
    drawHand(date.getMinutes(), 'minute');
    drawHand(date.getSeconds(), 'second');
}

function drawClock(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawCircle();
    drawCenter();
    drawHands();
    drawNumberals();
}

//initialization

context.font = font_height + 'px Arial';
loop = setInterval(drawClock, 1000);
    