<template lang="html">
  <div class="">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
export default {
  mounted () {
    var canvas = document.querySelector('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    var c = canvas.getContext('2d')

    var colorList = [
      '#ffea2c',
      '#ffffff',
      '#03a9f4'
    ]
    var gravity = 1
    var friction = 0.9
    var ballArray
    var radius
    init()
    animate()
    function init () {
      ballArray = []
      for (var i = 0; i < 150; i++) {
        radius = random(20, 40)
        ballArray.push(new Circle(random(0 + radius, canvas.width - radius), random(0, canvas.height / 2),
        random(-8, 5), 2, radius, true))
      }
    }
    function animate () {
      requestAnimationFrame(animate)
      c.clearRect(0, 0, canvas.width, canvas.height)
      for (var i = 0; i < ballArray.length; i++) {
        ballArray[i].update()
      }
    }
    function Circle (x, y, dx, dy, radius, cache) {
      this.x = x
      this.y = y
      this.dx = dx
      this.dy = dy
      this.radius = radius
      this.color = colorList[Math.floor(Math.random() * colorList.length)]
      this.cache = cache
      this.cacheCanvas = document.createElement('canvas')
      this.cacheC = this.cacheCanvas.getContext('2d')
      this.cacheCanvas.width = this.radius * 2 + 4
      this.cacheCanvas.height = this.radius * 2 + 4

      this.cacheC.beginPath()
      this.cacheC.arc(this.radius + 2, this.radius + 2, this.radius, 0, Math.PI * 2, false)
      this.cacheC.fillStyle = colorList[Math.floor(Math.random() * colorList.length)]
      this.cacheC.fill()
      this.cacheC.stroke()

      this.draw = function () {
        if (this.cache) {
          c.drawImage(this.cacheCanvas, this.x - this.radius - 2, this.y - this.radius - 2)
        } else {
          c.beginPath()
          c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
          c.fillStyle = this.color
          c.fill()
          c.stroke()
        }
      }

      this.update = function () {
        if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
          this.dx = -this.dx * friction
        }

        if (this.y + this.radius + this.dy > canvas.height) {
          this.dy = -this.dy * friction
        } else {
          this.dy += gravity
        }
        this.x += this.dx
        this.y += this.dy

        this.draw()
      }
    }
    function random (a, b) {
      return Math.random() * (b - a) + a
    }
    window.addEventListener('resize', function (e) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      init()
    })
    window.addEventListener('click', function (e) {
      init()
    })
  }
}
</script>

<style lang="css">
body {
  margin: 0;
}
#canvas {
  background-color: #d2ece7;
}
#app {
  margin: 0;
}
</style>
