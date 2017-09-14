// strokeRect() 方法需要设置lineWidth属性
context.lineJoin = 'round';
context.lineWidth = 30;
//

context.font = '24px Helvetica';
context.fillText('Click anyWhere to ease', 175, 40);

context.strokeRect(75, 100, 200, 200);
context.fillRect(325, 100, 200, 200);

context.canvas.onmousedown = function (e) {

    context.clearRect(0, 0, canvas.width, canvas.height);

};