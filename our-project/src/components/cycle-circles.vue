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
    var mouse = {
      x: undefined,
      y: undefined
    }
    var colorList = [
      '#126872',
      '#007269',
      '#00A588'
    ]

    var circleArray = []
    function MainCircle (x, y, radius) {
      this.x = x
      this.y = y
      this.radius = radius
      this.draw = function () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
      }

      this.update = function () {
        this.draw()
      }
    }

    var mainCircle
    function init () {
      mainCircle = new MainCircle(canvas.width / 2, canvas.height / 2, 200)
      var radius = 2
      var deg
      for (var i = 0; i < 30; i++) {
        deg = getRandom(0, 360)
        circleArray.push(new Circle(mainCircle.x, mainCircle.y, radius, deg))
      }
    }
    function getRadian (deg) {
      return deg * Math.PI / 180
    }
    function getRandom (a, b) {
      return Math.floor(Math.random() * (b - a) + a)
    }
    function getRandomColor () {
      return colorList[Math.floor(Math.random() * colorList.length)]
    }
    function Circle (x, y, radius, deg) {
      this.x = x
      this.y = y
      this.radius = radius
      this.deg = deg
      this.color = getRandomColor()

      this.draw = function () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
      }

      this.update = function (mainCircle) {
        this.x = mainCircle.x + mainCircle.radius * Math.cos(getRadian(this.deg))
        this.y = mainCircle.y + mainCircle.radius * Math.sin(getRadian(this.deg))
        this.draw()
      }
    }

    init()
    animate()

    function animate () {
      window.requestAnimationFrame(animate)
      c.fillStyle = 'rgba(255, 255, 255, 0.05)'
      c.fillRect(0, 0, canvas.width, canvas.height)
      for (var i = 0; i < circleArray.length; i++) {
        if (i <= circleArray.length / 4) {
          circleArray[i].deg += 1
        } else if (i > circleArray.length / 4 && i <= circleArray.length / 4 * 2) {
          circleArray[i].deg += 1.5
        } else if (i > circleArray.length / 4 * 2 && i <= circleArray.length / 4 * 3) {
          circleArray[i].deg += 2
        } else {
          circleArray[i].deg += 3
        }
        circleArray[i].update({
          x: mainCircle.x,
          y: mainCircle.y,
          radius: mainCircle.radius - i * circleArray[i].radius * 3
        })
      }
    }

    window.addEventListener('resize', function (e) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    })

    window.addEventListener('mousemove', function (e) {
      mouse.x = e.x
      mouse.y = e.y

      mainCircle.x = mouse.x
      mainCircle.y = mouse.y
    })
  }
}
</script>

<style lang="css">
body {
  margin: 0;
}
canvas {
  background-color: #f6f6f6;
}
#app {
  margin: 0;
}
</style>
