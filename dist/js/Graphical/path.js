function drawGrid(t,e,o,a){t.strokeStyle=e,t.lineWidth=.5;for(n=o+.5;n<t.canvas.width;n+=o)t.beginPath(),t.moveTo(n,0),t.lineTo(n,t.canvas.height),t.stroke();for(var n=a+.5;n<t.canvas.height;n+=a)t.beginPath(),t.moveTo(0,n),t.lineTo(t.canvas.width,n),t.stroke()}function drawTwoArcs(){context.beginPath(),context.arc(250,250,150,0,2*Math.PI,!1),context.arc(250,250,100,0,2*Math.PI,!0),context.fill(),context.shadowOffsetX=0,context.shadowOffsetY=0,context.beginPath(),context.stroke()}function draw(){context.clearRect(0,0,canvas.width,canvas.height),drawGrid(context,"lightgray",10,10),context.save(),context.shadowColor="rgba(0, 0, 0, 0.8)",context.shadowOffsetX=12,context.shadowOffsetY=12,context.shadowBlur=15,drawTwoArcs(),context.restore()}context.fillStyle="rgba(100, 140, 230, 0.5)",context.strokeStyle=context.fillStyle,draw();