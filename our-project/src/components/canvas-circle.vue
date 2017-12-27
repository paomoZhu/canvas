<template lang="html">
  <div class="">
    <canvas></canvas>
  </div>
</template>

<script>
export default {
  mounted () {
    var canvas = document.querySelector('canvas')
    var innerWidth = window.innerWidth
    var innerHeight = window.innerHeight
    var density = 550 * 400 / 800
    canvas.width = innerWidth
    canvas.height = innerHeight
    var circles
    var c = canvas.getContext('2d')

    var circleArray = []
    var mouse = {
      x: undefined,
      y: undefined
    }
    var maxRadius = 40
    var colorArray = [
      '#363636',
      '#E85E4A',
      '#FFF9DA',
      '#79C2AA',
      '#608096'
    ]

    function init () {
      circleArray = []
      circles = Math.floor(window.innerWidth * window.innerHeight / density)
      for (var i = 0; i < circles; i++) {
        var radius = Math.random() * 3 + 1
        var x = Math.random() * (window.innerWidth - 2 * radius) + radius
        var y = Math.random() * (window.innerHeight - 2 * radius) + radius
        var dx = (Math.random() - 0.5)
        var dy = (Math.random() - 0.5)

        circleArray.push(new Circle(x, y, dx, dy, radius))
      }
    }

    init()
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.x
      mouse.y = e.y
    })
    window.addEventListener('resize', function (e) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      init()
    })
    animate()
    function animate () {
      requestAnimationFrame(animate)
      c.clearRect(0, 0, canvas.width, canvas.height)
      for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update()
      }
    }
    function Circle (x, y, dx, dy, radius) {
      this.x = x
      this.y = y
      this.dx = dx
      this.dy = dy
      this.radius = radius
      this.minRadius = radius
      this.color = colorArray[Math.floor((Math.random() * colorArray.length))]

      this.draw = function () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.strokeStyle = 'blue'
        c.fillStyle = this.color
        c.fill()
      }

      this.update = function () {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx
        }

        if (this.y + this.radius > canvas.width || this.y - this.radius < 0) {
          this.dy = -this.dy
        }

        if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
          if (this.radius < maxRadius) {
            this.radius += 1
          }
        } else if (this.radius > this.minRadius) {
          this.radius -= 1
        }

        this.x += this.dx
        this.y += this.dy

        this.draw()
      }
    }
  }
}
</script>

<style lang="css">
body {
  margin: 0;
}
#app {
  margin: 0;
}
</style>
