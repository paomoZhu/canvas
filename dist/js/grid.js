function drawGrid(t,e,o){context.save(),context.shadowColor=void 0,context.shadowOffsetX=0,context.shadowOffsetY=0,context.strokeStyle=t,context.fillStyle="#ffffff",context.lineWidth=.5,context.fillRect(0,0,canvas.width,canvas.height);for(n=e;n<context.canvas.width;n+=e)context.beginPath(),context.moveTo(n,0),context.lineTo(n,context.canvas.height),context.stroke();for(var n=o;n<context.canvas.height;n+=o)context.beginPath(),context.moveTo(0,n),context.lineTo(context.canvas.width,n),context.stroke();context.restore()}