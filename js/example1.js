var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

console.dir(context);

context.font = '38pt Arial';
context.fillStyle = 'cornflowerblue';
context.strokeStyle = 'blue';

context.fillText('Hello Canvas', canvas.width/2 - 150, canvas.height/2+ 15);
context.strokeText('Hello Canvas', canvas.width/2 - 150, canvas.height/2 + 15);

window.canvasUrl = canvas.toDataURL('image/jpeg', 1);