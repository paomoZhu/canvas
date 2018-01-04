·<template lang="html">
  <div class="">
    <canvas></canvas>
  </div>
</template>

<script>
export default {
  mounted () {
    var canvas = document.querySelector('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    var ratio = 1200 * 800 / 250
    var c = canvas.getContext('2d')
    var mouse = {
      x: canvas.width / 4,
      y: canvas.height / 4
    }
    var ballArray

    var colorList = [
      '#6B5651',
      '#E29698',
      '#C0AF9D',
      '#DED5C9',
      '#B96162'
    ]

    // var circle = new Circle(canvas.width / 2, canvas.height / 2, 200, false)
    function getRandomColor () {
      return colorList[Math.floor(Math.random() * colorList.length)]
    }
    function getDistance (x1, y1, x2, y2) {
      var xDistance = x2 - x1
      var yDistance = y2 - y1
      return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
    }
    function rotateVelocity (velocity, angle) {
      // 坐标系转换公式
      return {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.y * Math.cos(angle) + velocity.x * Math.sin(angle)
      }
    }
    function reserveBalls (ball, otherBall) {
      var xVelocityDiff = otherBall.dx - ball.dx
      var yVelocityDiff = otherBall.dy - ball.dy
      var xDist = otherBall.x - ball.x
      var yDist = otherBall.y - ball.y

      // 防止小球偶然的交叠 ? 有点问题
      if (xVelocityDiff * xDist + yVelocityDiff * yDist <= 0) {
        // 这里的-号， 因为canvas角度的测量方式
        var angle = -Math.atan2(otherBall.y - ball.y, otherBall.x - ball.x)

        var u1 = rotateVelocity({x: ball.dx, y: ball.dy}, angle)
        var u2 = rotateVelocity({x: otherBall.dx, y: otherBall.dy}, angle)

        var v1 = {x: ((ball.m - otherBall.m) * u1.x + 2 * otherBall.m * u2.x) / (ball.m + otherBall.m), y: u1.y}
        var v2 = {x: ((otherBall.m - ball.m) * u2.x + 2 * ball.m * u1.x) / (ball.m + otherBall.m), y: u2.y}

        var fxV1 = rotateVelocity(v1, -angle)
        var fxV2 = rotateVelocity(v2, -angle)

        ball.dx = fxV1.x
        ball.dy = fxV1.y
        otherBall.dx = fxV2.x
        otherBall.dy = fxV2.y
      }
    }
    function Circle (x, y, dx, dy, radius, cache, id) {
      this.x = x
      this.y = y
      this.dx = dx
      this.dy = dy
      this.radius = radius
      this.m = 1 * this.radius
      this.cacheCanvas = document.createElement('canvas')
      this.cacheC = this.cacheCanvas.getContext('2d')
      this.cacheCanvas.width = this.radius * 2 + 4
      this.cacheCanvas.height = this.radius * 2 + 4
      this.cache = cache
      this.color = getRandomColor()
      this.opacity = 0
      this.cacheC.beginPath()
      this.cacheC.arc(this.radius + 2, this.radius + 2, this.radius, 0, Math.PI * 2, false)
      this.cacheC.strokeStyle = '#666'
      this.cacheC.strokeStyle = getRandomColor()
      // this.cacheC.fill()
      this.cacheC.stroke()

      this.draw = function () {
        if (this.cache) {
          c.drawImage(this.cacheCanvas, this.x - this.radius - 4, this.y - this.radius - 4)
        } else {
          c.beginPath()
          c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
          c.strokeStyle = this.color
          c.save()
          c.globalAlpha = this.opacity
          c.fillStyle = this.color
          c.fill()
          c.restore()
          c.stroke()
        }
      }

      this.update = function (balls) {
        for (var i = 0; i < balls.length; i++) {
          if (this === balls[i]) { continue }
          if (getDistance(this.x, this.y, balls[i].x, balls[i].y) - this.radius * 2 < 0) {
            reserveBalls(this, balls[i])
          }
        }
        if (this.x + this.radius >= window.innerWidth || this.x - this.radius <= 0) {
          this.dx = -this.dx
        }

        if (this.y + this.radius >= window.innerHeight || this.y - this.radius <= 0) {
          this.dy = -this.dy
        }

        this.y += this.dy
        this.x += this.dx

        if (getDistance(mouse.x, mouse.y, this.x, this.y) < 150 && this.opacity < 0.4) {
          this.opacity += 0.02
        } else if (this.opacity > 0) {
          this.opacity -= 0.02
          this.opacity = Math.max(0, this.opacity)
        }

        this.draw()
      }
    }

    function init () {
      var radius = 20
      var x = getRandom(0 + radius, window.innerWidth - radius)
      var y = getRandom(0 + radius, window.innerHeight - radius)
      var dx
      var dy

      ballArray = []

      for (var i = 0; i < Math.floor(window.innerWidth * window.innerHeight / ratio); i++) {
        dx = getRandom(-2, 2)
        dy = getRandom(-2, 2)
        if (i !== 0) {
          for (var j = 0; j < ballArray.length; j++) {
            if (getDistance(x, y, ballArray[j].x, ballArray[j].y) < radius * 2) {
              x = getRandom(0 + radius, window.innerWidth - radius)
              y = getRandom(0 + radius, window.innerHeight - radius)
              j = -1
            }
          }
        }
        ballArray.push(new Circle(x, y, dx, dy, radius, false, i))
      }
    }

    init()
    animate()

    function animate () {
      window.requestAnimationFrame(animate)
      c.clearRect(0, 0, canvas.width, canvas.height)
      for (var i = 0; i < ballArray.length; i++) {
        ballArray[i].update(ballArray)
      }
    }

    function getRandom (min, max) {
      var v = Math.floor(Math.random() * (max - min)) + min
      while (v === 0) {
        v = Math.floor(Math.random() * (max - min)) + min
      }
      return v
    }

    window.addEventListener('mousemove', function (e) {
      mouse.x = e.x
      mouse.y = e.y
      for (var i = 0; i < ballArray.length; i++) {
        if (getDistance(mouse.x, mouse.y, ballArray[i].x, ballArray[i].y) < 150 && ballArray[i].opacity < 0.4) {
          ballArray[i].opacity += 0.02
        }
      }
    })

    window.addEventListener('resize', function (e) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      init()
    })
  }
}
</script>

<style lang="css">
#app {
  margin: 0;
}
body {
  margin: 0;
}
canvas {
  background: whitesmoke;
}
</style>
