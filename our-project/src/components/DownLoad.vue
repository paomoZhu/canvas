<template>
  <div>
    <div class="logo row">
      <h2 class="col s12">
        见客
      </h2>
    </div>

    <div class="col s2 m2" v-bind:style="{ backgroundColor: color}">
      <p class="z-depth-1" style="color: #fff">color</p>
    </div>

    <div class="row valign-wrapper" id="main">
      <div class="col s6 m6 valign" id="canvas-box">
        <ul class="tool-slider">
          <li>
            <div class="col s2">
              <img v-show="model === 'phone'" v-on:click="changeModal()" src="../assets/phone-modal.png">
              <img v-show="model === 'mac'" v-on:click="changeModal()" src="../assets/mac-modal.png" style="width: 30px;height: 30px;margin: 4px 2px;">
            </div>
          </li>
          <li>
            <div class="col s2 color-board">
              <input type="color" class="flow-text" id="color-select" v-model="color" v-on:change="selectColor(deltaY)">
              <img src="../assets/color-board.png">
            </div>
          </li>
          <li>
            <div class="col s2 horizontal">
              <img src="../assets/download.png" v-on:click="download('jpg')">
            </div>
          </li>
        </ul>
        <!-- 800 450-->
        <div class="canvas-container" v-bind:class="{'canvas-mac': model == 'mac', 'canvas-phone': model == 'phone'}">
          <canvas id="canvas" class="valign" v-on:mousedown="bindMove($event)" v-on:mousewheel="aa($event)"></canvas>
        </div>
      </div>
      <div class="col s6 m6" style="position: relative;">
        测试 222
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'downLoad',
    data () {
      return {
        color: '',
        pic: new Image(),
        deltaY: 1,
        offset: {
          x: 0,
          y: 0,
          diffX: 0,
          diffY: 0,
          imgPosX: 0,
          imgPosY: 0
        },
        originSize: {
          phone: {
            borderWidth: 38,
            borderHeight: 136,
            canvasHeight: 396
          },
          mac: {
            borderWidth: 208,
            borderHeight: 128,
            canvasWidth: 480,
            top: -4,
            left: 10.5
          }
        },
        model: 'phone',
        changeModal: function () {
          this.model = (this.model === 'phone' ? 'mac' : 'phone')
          initDraw.call(this, 'noBind')
          function initDraw (noBind) {
            var init = this.selectColor
            var canvas = $('#canvas')
            var self = this
            var mainBox = $('#main')
            var windowDom = $(window)
            var toolSlider = $('.tool-slider')
            var colorBoard = $('.color-board img')
            var canvasContainer = $('.canvas-container')
            mainBox.height(windowDom.height() - 170)
            if (this.model !== 'phone') {
              initCanvasBoxunderModal('mac')
            } else {
              initCanvasBoxunderModal('phone')
            }

            if (!noBind) {
              this.pic.onload = function () {
                init.call(self, self.deltaY)
              }
              windowDom.resize(function () {
                mainBox.height(windowDom.height() - 170)
                fixCanvasBox()
              })
              colorBoard.on('click', function () {
                $('.flow-text').trigger('click')
              })
            }
            function fixCanvasBox () {
              if (windowDom.height() < 800) {
                toolSlider.addClass('fix-tool')
              } else {
                toolSlider.removeClass('fix-tool')
              }

              initCanvasBoxunderModal(self.model)
              init.call(self, self.deltaY)
            }
            function initCanvasBoxunderModal (modal) {
              var canvasHeight
              var canvasWidth
              var scale
              if (modal === 'phone') {
                canvasHeight = mainBox.height() * 3 / 5
                canvasWidth = Math.ceil(canvasHeight * 7 / 12)
                canvas.get(0).width = canvasWidth
                canvas.get(0).height = canvasHeight
                self.offset.imgPosX = -canvas.height() / 4
                self.offset.imgPosY = -canvas.width() / 4
                canvasContainer.height(canvasHeight)
                canvasContainer.width(canvasWidth)
                scale = canvasHeight / self.originSize[modal].canvasHeight
                canvasContainer.css({
                  left: 0
                })
                $('head').append('<style>.canvas-phone:after{ width:calc(100% + ' + scale * self.originSize[modal].borderWidth + 'px) !important;height:calc(100% + ' + scale * self.originSize[modal].borderHeight + 'px) !important; }</style>')
              } else if (modal === 'mac') {
                canvasWidth = mainBox.width() * 2 / 5
                canvasHeight = canvasWidth * 9 / 16
                canvas.get(0).width = canvasWidth
                canvas.get(0).height = canvasHeight
                self.offset.imgPosX = -canvas.width() / 4
                self.offset.imgPosY = -canvas.height() / 4
                canvasContainer.height(canvasHeight)
                canvasContainer.width(canvasWidth)
                scale = canvasWidth / self.originSize[modal].canvasWidth
                canvasContainer.css({
                  left: 50 * scale + 'px'
                })
                $('head').append('<style>.canvas-mac:after{ width:calc(100% + ' + scale * self.originSize[modal].borderWidth + 'px) !important;height:calc(100% + ' + scale * self.originSize[modal].borderHeight + 'px) !important;left: calc(50% + ' + scale * self.originSize[modal].left + 'px);top: calc(50% + ' + scale * self.originSize[modal].top + 'px); }</style>')
              }
              init.call(self, self.deltaY)
            }
          }
        },
        selectColor: function (zoom, offsetX, offsetY) {
          var canvas = $('#canvas')
          var ctx = canvas.get(0).getContext('2d')
          var width = canvas.get(0).width
          var height = canvas.get(0).height
          var zoomSize = zoom || 1
          console.log(width, height)
          ctx.clearRect(0, 0, width, height)
          ctx.fillStyle = this.color
          ctx.translate(width / 2, height / 2)
          ctx.scale(zoomSize, zoomSize)
          ctx.fillRect(-width / (2 * zoomSize), -height / (2 * zoomSize), width / zoomSize, height / zoomSize)
          if (this.model === 'phone') {
            ctx.drawImage(this.pic, this.offset.imgPosX + (offsetX || 0), this.offset.imgPosY + (offsetY || 0), height / 2, width / 2)
          } else {
            ctx.drawImage(this.pic, this.offset.imgPosX + (offsetX || 0), this.offset.imgPosY + (offsetY || 0), width / 2, height / 2)
          }
          ctx.scale(1 / zoomSize, 1 / zoomSize)
          ctx.translate(-width / 2, -height / 2)
        },
        aa: function (event) {
          this.deltaY += (event.deltaY / 120)
          if (this.deltaY < 0.25) {
            this.deltaY = 0.25
          } else if (this.deltaY > 5) {
            this.deltaY = 5
          }
          this.selectColor(this.deltaY)

          event.preventDefault()
        },
        bindMove: function (event) {
          event.preventDefault()
          var canvas = $('#canvas')
          var self = this
          self.offset.x = event.offsetX
          self.offset.y = event.offsetY
          self.offset.init = true
          canvas.css({
            'cursor': 'move'
          })
          canvas.on('mousemove', function (event) {
            self.selectColor(self.deltaY, (event.offsetX - self.offset.x) / self.deltaY, (event.offsetY - self.offset.y) / self.deltaY)
          })

          canvas.on('mouseleave', function (event) {
            $(document).unbind('mouseup')
          })

          $(document).on('mouseup', function (event) {
            self.offset.diffX = (event.offsetX - self.offset.x) / self.deltaY
            self.offset.diffY = (event.offsetY - self.offset.y) / self.deltaY
            self.offset.imgPosX += self.offset.diffX
            self.offset.imgPosY += self.offset.diffY
            console.log(self.offset.imgPosX, self.offset.imgPosX)
            canvas.unbind('mousemove')
            $(document).unbind('mouseup')
            canvas.css({
              'cursor': 'pointer'
            })
          })
        },
        download: function (type) {
          var canvas = $('#canvas')
          var imgdata = canvas.get(0).toDataURL(type)
          var fixtype = function (type) {
            type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg')
            var r = type.match(/png|jpeg|bmp|gif/)[0]
            return 'image/' + r
          }
          imgdata = imgdata.replace(fixtype(type), 'image/octet-stream')
          var saveFile = function (data, filename) {
            var link = document.createElement('a')
            link.href = data
            link.download = filename
            var event = document.createEvent('MouseEvents')
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            link.dispatchEvent(event)
          }
          var filename = new Date().toLocaleDateString() + '.' + type
          saveFile(imgdata, filename)
        }
      }
    },
    created: function () {
      this.color = '#fffcf8'
      this.pic.src = '../assets/cover_1.png'
    },
    mounted: function (noBind) {
      var init = this.selectColor
      var canvas = $('#canvas')
      var self = this
      var mainBox = $('#main')
      var windowDom = $(window)
      var toolSlider = $('.tool-slider')
      var colorBoard = $('.color-board img')
      var canvasContainer = $('.canvas-container')
      mainBox.height(windowDom.height() - 170)
      if (this.model !== 'phone') {
        initCanvasBoxunderModal('mac')
      } else {
        initCanvasBoxunderModal('phone')
      }

      if (!noBind) {
        this.pic.onload = function () {
          init.call(self, self.deltaY)
        }
        windowDom.resize(function () {
          mainBox.height(windowDom.height() - 170)
          fixCanvasBox()
        })
        colorBoard.on('click', function () {
          $('.flow-text').trigger('click')
        })
      }
      function fixCanvasBox () {
        if (windowDom.height() < 800) {
          toolSlider.addClass('fix-tool')
        } else {
          toolSlider.removeClass('fix-tool')
        }

        initCanvasBoxunderModal(self.model)
        init.call(self, self.deltaY)
      }
      function initCanvasBoxunderModal (modal) {
        var canvasHeight
        var canvasWidth
        var scale
        if (modal === 'phone') {
          canvasHeight = mainBox.height() * 3 / 5
          canvasWidth = Math.ceil(canvasHeight * 7 / 12)
          canvas.get(0).width = canvasWidth
          canvas.get(0).height = canvasHeight
          self.offset.imgPosX = -canvas.height() / 4
          self.offset.imgPosY = -canvas.width() / 4
          canvasContainer.height(canvasHeight)
          canvasContainer.width(canvasWidth)
          scale = canvasHeight / self.originSize[modal].canvasHeight
          canvasContainer.css({
            left: 0
          })
          $('head').append('<style>.canvas-phone:after{ width:calc(100% + ' + scale * self.originSize[modal].borderWidth + 'px) !important;height:calc(100% + ' + scale * self.originSize[modal].borderHeight + 'px) !important; }</style>')
        } else if (modal === 'mac') {
          canvasWidth = mainBox.width() * 2 / 5
          canvasHeight = canvasWidth * 9 / 16
          canvas.get(0).width = canvasWidth
          canvas.get(0).height = canvasHeight
          self.offset.imgPosX = -canvas.width() / 4
          self.offset.imgPosY = -canvas.height() / 4
          canvasContainer.height(canvasHeight)
          canvasContainer.width(canvasWidth)
          scale = canvasWidth / self.originSize[modal].canvasWidth
          canvasContainer.css({
            left: 50 * scale + 'px'
          })
          $('head').append('<style>.canvas-mac:after{ width:calc(100% + ' + scale * self.originSize[modal].borderWidth + 'px) !important;height:calc(100% + ' + scale * self.originSize[modal].borderHeight + 'px) !important;left: calc(50% + ' + scale * self.originSize[modal].left + 'px);top: calc(50% + ' + scale * self.originSize[modal].top + 'px); }</style>')
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .flow-text {
    position: absolute;
    left: 101% !important;
  }
  .logo h2 {
    font-weight: 300;
    margin: -30px 0 0 0;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  #color-select {
    border: none;
    width: 33px;
    height: 33px;
    border-radius: 5px;
    background-color: #fff;
    outline: none;
    cursor: pointer;
    padding: 2px 3px;
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
  }

  #color-select::-webkit-color-swatch-wrapper{
    padding: 1px 0;
  }
  #color-select::-webkit-color-swatch {
    border: 0;
    border-radius: 5px;
  }
  #color-select:hover {
    border-color: #777;
  }
  #color-select:active {
    border-color: #777;
  }

  #canvas {
    /*border: 1px solid #666;*/
    /*box-shadow: 0 0 3px;*/
    cursor: pointer;
  }

  .tool-slider {
    position: absolute;
    top: 50%;
    left: 0;
    margin: 0;
    transform: translateY(-50%);
    box-shadow: 0 0 2px;
    height: 113px;
    background-color: #fff;
    z-index: 99;
  }

  .fix-tool {
    top: 400px;
  }

  .tool-slider li {
    margin: 2px 2px;
    width: 35px;
    height: 35px;
    display: block;
  }

  .color-board img {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 30px !important;
    height: 30px !important;
    margin: 2px 3px;
  }

  .color-board {
    position: relative;
  }

  .tool-slider li img {
    width: 35px;
    height: 35px;
  }

  .tool-slider li div{
    padding: 0;
    width: 100% !important;
    /*border-radius: 5px;*/
    height: 35px;
    position: relative;
    overflow: hidden;
  }

  .tool-slider li div:hover {
    background-color: #dedede;
    cursor: pointer;
  }

  .tool-slider li div:active {
    background-color: #aaa;
  }

  .canvas-container {
    display:inline-block;
    position: relative;
    z-index: 10;
  }

  #canvas {
    position: relative;
    z-index: 2;
  }

  .canvas-phone:after {
    content: 'aàaaaa';
    font-size: 0;
    /* 4px 为调整数值 */
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: 50%;
    background-image: url(../assets/I6.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: 1;
  }
  .canvas-mac:after {
    content: 'aàaaaa';
    font-size: 0;
    position: absolute;
    /*left: calc(50% + 10.5px);*/
    transform: translate(-50%, -50%);
    /*top: calc(50% - 4px);*/
    /*width: calc(100% + 208px);*/
    /*height: calc(100% + 128px);*/
    background-image: url(../assets/mac.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: 1;
  }
</style>
