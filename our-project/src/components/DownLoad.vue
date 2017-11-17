<template>
  <div>
    <div class="logo row">
      <h2 class="col s12">
        一笔一画
      </h2>
    </div>

    <img src="../assets/bgpic.png" style="display: none" alt="">

    <div class="row valign-wrapper" id="main" style="overflow: hidden;position: relative">
      <img id="load-pic-container" style="position: absolute; top: 9999px" src="">
      <div class="col s6 m6 valign" id="canvas-box">
        <ul class="tool-slider">
          <li>
            <div class="col s2">
              <img v-show="model === 'mac'" v-on:click="changeModal()" src="../assets/phone-modal.png" class="tooltipped" data-position="right" data-delay="0" data-tooltip="手机模式">
              <img v-show="model === 'phone'" v-on:click="changeModal()" src="../assets/mac-modal.png" style="width: 30px;height: 30px;margin: 4px 2px;" class="tooltipped" data-position="right" data-delay="0" data-tooltip="电脑模式">
            </div>
          </li>
          <li>
            <div class="col s2 color-board">
              <input type="color" class="flow-text" id="color-select" v-model="color" v-on:change="selectColor(deltaY, null, null, undefined, undefined, undefined, initRate)">
              <img src="../assets/color-board.png" class="tooltipped" data-position="right" data-delay="0" data-tooltip="设置背景色">
            </div>
          </li>
          <li>
            <div class="col s2 horizontal">
              <img src="../assets/download.png" v-on:click="download('jpg')" class="tooltipped" data-position="right" data-delay="0" data-tooltip="下载图片">
            </div>
          </li>
        </ul>
        <div class="canvas-container" v-bind:class="{'canvas-mac': model == 'mac', 'canvas-phone': model == 'phone'}">
          <canvas id="canvas" class="valign" v-on:mousedown="bindMove($event)" v-on:mousewheel="aa($event)"></canvas>
        </div>
      </div>
      <div class="col s6 m6" style="position: relative;">
        <div class="row">
          <div class="waves-effect waves-light btn" id="load-pic-div" style="position: relative; overflow: hidden">
            {{loadText}}
            <i class="material-icons Medium right">work</i>
            <input type="file" style="cursor: pointer;position: absolute; top: 0; left: 0;opacity: 0;width: 100%; height: 100%;" class="waves-effect waves-light btn" id="load-pic">
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <label>原画作者：</label>
            <span>QMeiZi</span>
          </div>
          <div class="col s12">
            <label>来自：</label>
            <span>站酷</span>
          </div>
          <div class="col s12">
            <label>原画大小：</label>
            <span>{{originSize.pic.width}} · {{originSize.pic.height}}</span>
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            下载图片规格:
            <div class="input-field inline">
              <input id="pic-width" placeholder="宽度" type="number" v-model="importWidth" v-on:change="setImport('height')" class="validate">
            </div>
            <i class="material-icons">lock</i>
            <div class="input-field inline">
              <input id="pic-height" placeholder="高度" type="number" v-model="importHeight" v-on:change="setImport('width')" class="validate">
            </div>
          </div>
          <span class="thin" style="font-size: 13px">（ 默认当前画布大小 ）</span>
        </div>
        <canvas id="canvas2" style="position: absolute;top: -999999px"></canvas>
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
        importWidth: '',
        importHeight: '',
        deltaY: 1,
        loadText: '上传本地图片',
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
            borderWidth: 37,
            borderHeight: 130,
            canvasHeight: 396,
            top: 1
          },
          mac: {
            borderWidth: 208,
            borderHeight: 128,
            canvasWidth: 480,
            top: -4,
            left: 10.5
          },
          pic: {
            width: 1280,
            height: 859
          }
        },
        initRate: undefined,
        model: 'mac',
        setImport: function (key) {
          if (typeof this.importWidth === 'undefined' || typeof this.importHeight === 'undefined' || (this.importHeight === '' && key === 'width') || (this.importWidth === '' && key === 'height')) {
            this.importWidth = ''
            this.importHeight = ''
            window.Materialize.toast('修改完成!', 2000)
            return false
          }
          if (this.model === 'phone') {
            this.importWidth = key === 'width' ? Math.ceil(this.importHeight * 7 / 12) : this.importWidth
            this.importHeight = key === 'height' ? Math.ceil(this.importWidth * 12 / 7) : this.importHeight
          }
          if (this.model === 'mac') {
            this.importWidth = key === 'width' ? Math.ceil(this.importHeight * 16 / 9) : this.importWidth
            this.importHeight = key === 'height' ? Math.ceil(this.importWidth * 9 / 16) : this.importHeight
          }
          window.Materialize.toast('修改完成！', 2000)
        },
        changeModal: function () {
          this.importWidth = ''
          this.importHeight = ''
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
              init.call(self, self.deltaY, null, null, undefined, undefined, undefined, self.initRate)
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
                if (self.initRate) {
                  self.offset.imgPosY = self.offset.imgPosX / self.initRate
                } else {
                  self.offset.imgPosY = -canvas.width() / 4
                }
                canvasContainer.height(canvasHeight)
                canvasContainer.width(canvasWidth)
                scale = canvasHeight / self.originSize[modal].canvasHeight
                canvasContainer.css({
                  left: 0
                })
                $('head').append('<style>.canvas-phone:after{ width:calc(100% + ' + scale * self.originSize[modal].borderWidth + 'px) !important;height:calc(100% + ' + scale * self.originSize[modal].borderHeight + 'px) !important;top: calc(50% + ' + scale * self.originSize[modal].top + 'px); }</style>')
              } else if (modal === 'mac') {
                canvasWidth = mainBox.width() * 2 / 5
                canvasHeight = Math.ceil(canvasWidth * 9 / 16)
                canvas.get(0).width = canvasWidth
                canvas.get(0).height = canvasHeight
                self.offset.imgPosX = -canvas.width() / 4
                if (self.initRate) {
                  self.offset.imgPosY = self.offset.imgPosX / self.initRate
                } else {
                  self.offset.imgPosY = -canvas.height() / 4
                }
                canvasContainer.height(canvasHeight)
                canvasContainer.width(canvasWidth)
                scale = canvasWidth / self.originSize[modal].canvasWidth
                canvasContainer.css({
                  left: 50 * scale + 'px'
                })
                $('head').append('<style>.canvas-mac:after{ width:calc(100% + ' + scale * self.originSize[modal].borderWidth + 'px) !important;height:calc(100% + ' + scale * self.originSize[modal].borderHeight + 'px) !important;left: calc(50% + ' + scale * self.originSize[modal].left + 'px);top: calc(50% + ' + scale * self.originSize[modal].top + 'px); }</style>')
              }
              init.call(self, self.deltaY, null, null, undefined, undefined, undefined, self.initRate)
            }
          }
        },
        selectColor: function (zoom, offsetX, offsetY, imgPosX, imgPosY, selector, initRate) {
          var canvas = typeof selector !== 'undefined' ? $(selector) : $('#canvas')
          var ctx = canvas.get(0).getContext('2d')
          var width = canvas.get(0).width
          var height = canvas.get(0).height
          var tempInitWidth = width
          var tempInitheight = height
          var zoomSize = zoom || 1
          var imgPos = {
            x: typeof imgPosX !== 'undefined' ? imgPosX : this.offset.imgPosX,
            y: typeof imgPosY !== 'undefined' ? imgPosY : this.offset.imgPosY
          }
          ctx.clearRect(0, 0, width, height)
          ctx.fillStyle = this.color
          ctx.translate(width / 2, height / 2)
          ctx.scale(zoomSize, zoomSize)
          ctx.fillRect(-width / (2 * zoomSize), -height / (2 * zoomSize), width / zoomSize, height / zoomSize)
          if (this.model === 'phone') {
            tempInitWidth = (typeof initRate !== 'undefined') ? (height / initRate) : width
            ctx.drawImage(this.pic, imgPos.x + (offsetX || 0), imgPos.y + (offsetY || 0), height / 2, tempInitWidth / 2)
          } else {
            tempInitheight = (typeof initRate !== 'undefined') ? (width / initRate) : height
            ctx.drawImage(this.pic, imgPos.x + (offsetX || 0), imgPos.y + (offsetY || 0), width / 2, tempInitheight / 2)
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
          this.selectColor(this.deltaY, null, null, undefined, undefined, undefined, this.initRate)

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
          canvas.on('contextmenu', function (event) {
            event.preventDefault()
          })
          canvas.on('mousemove', function (event) {
            self.selectColor(self.deltaY, (event.offsetX - self.offset.x) / self.deltaY, (event.offsetY - self.offset.y) / self.deltaY, undefined, undefined, undefined, self.initRate)
          })

          canvas.on('mouseleave', function () {
            $(document).unbind('mouseup')
          })

          $(document).on('mouseup', function (event) {
            self.offset.diffX = (event.offsetX - self.offset.x) / self.deltaY
            self.offset.diffY = (event.offsetY - self.offset.y) / self.deltaY
            self.offset.imgPosX += self.offset.diffX
            self.offset.imgPosY += self.offset.diffY
            canvas.unbind('mousemove')
            $(document).unbind('mouseup')
            canvas.css({
              'cursor': 'pointer'
            })
          })
        },
        download: function (type) {
          var importWidth = $('#pic-width')
          var importHeight = $('#pic-height')
          initDraw.call(this)
          function initDraw () {
            var init = this.selectColor
            var canvas = $('#canvas2')
            var self = this
            var mainBox = $('#main')
            if (this.model !== 'phone') {
              initCanvasBoxunderModal('mac')
            } else {
              initCanvasBoxunderModal('phone')
            }

            function initCanvasBoxunderModal (modal) {
              var canvasHeight
              var canvasWidth
              var scale
              if (modal === 'phone') {
                canvasHeight = importHeight.val() ? importHeight.val() : mainBox.height() * 3 / 5
                canvasWidth = Math.round(canvasHeight * 7 / 12)
                canvas.get(0).width = canvasWidth
                canvas.get(0).height = canvasHeight
                scale = canvasHeight / $('#canvas').height()
              } else if (modal === 'mac') {
                canvasWidth = importWidth.val() ? importWidth.val() : mainBox.width() * 2 / 5
                canvasHeight = Math.round(canvasWidth * 9 / 16)
                canvas.get(0).width = canvasWidth
                canvas.get(0).height = canvasHeight
                scale = canvasWidth / $('#canvas').width()
              }
              init.call(self, self.deltaY, null, null, self.offset.imgPosX * scale, self.offset.imgPosY * scale, '#canvas2', self.initRate)
            }
          }
          var canvas = $('#canvas2')
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
//      this.pic.src = '../static/img/cover_1.8027e65.png'
      this.pic.src = '/laboratory/static/img/cover_1.8027e65.png'
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
      var fileLoad = $('#load-pic')
      var fileReader = new FileReader()
      var fileLoadContainer = $('#load-pic-container')
      $('body').css({
//        'background-image': 'url(../static/img/bgpic.429b3d0.png)'
        'background-image': 'url(/laboratory/static/img/bgpic.429b3d0.png)'
      })
      mainBox.height(windowDom.height() - 170)
      if (this.model === 'phone') {
        initCanvasBoxunderModal('phone')
      } else {
        initCanvasBoxunderModal('mac')
      }

      if (!noBind) {
        this.pic.onload = function () {
          // 初始化数据
          initCanvasBoxunderModal(self.model)
          if (self.initRate) {
            self.offset.imgPosY = self.offset.imgPosX / self.initRate
            init.call(self, self.deltaY, null, null, undefined, undefined, undefined, self.initRate)
          } else {
            init.call(self, self.deltaY)
          }
          window.Materialize.toast('加载完毕！', 2000)
        }
        windowDom.resize(function () {
          mainBox.height(windowDom.height() - 170)
          fixCanvasBox()
        })
        colorBoard.on('click', function () {
          $('.flow-text').trigger('click')
        })
        fileLoad.on('change', function (event) {
          var AllImgExt = '.jpg|.jpeg|.gif|.bmp|.png'
          var file = $(event.target).get(0).files[0]
          if (typeof file === 'undefined') {
            window.Materialize.toast('请上传一张图片！', 2000)
            return false
          }
          if (!file.name.match(AllImgExt)) {
            window.Materialize.toast('上传图片格式错误！', 2000)
            return false
          }
          self.loadText = file.name || '上传本地图片'
          fileReader.readAsDataURL(file)
          window.Materialize.toast('读取数据中...', 2000)
          fileReader.onload = function (file) {
            fileLoadContainer.get(0).src = file.target.result
            window.Materialize.toast('读取完成！', 2000)
            fileLoadContainer.on('load', function () {
              window.Materialize.toast('加载图片中..', 2000)
              self.originSize.pic.width = fileLoadContainer.width()
              self.originSize.pic.height = fileLoadContainer.height()
              self.initRate = fileLoadContainer.width() / fileLoadContainer.height()
              self.pic.src = file.target.result
              fileLoadContainer.unbind('load')
            })
          }
        })
      }
      function fixCanvasBox () {
        if (windowDom.height() < 800) {
          toolSlider.addClass('fix-tool')
        } else {
          toolSlider.removeClass('fix-tool')
        }
        // resize 不需要改变位置
        var scale = initCanvasBoxunderModal(self.model, 'noInit')
        init.call(self, self.deltaY, null, null, self.offset.imgPosX * scale, self.offset.imgPosY * scale, undefined, self.initRate)
      }
      function initCanvasBoxunderModal (modal, isInit) {
        var canvasHeight
        var canvasWidth
        var scale
        if (modal === 'phone') {
          canvasHeight = mainBox.height() * 3 / 5
          canvasWidth = Math.ceil(canvasHeight * 7 / 12)
          canvas.get(0).width = canvasWidth
          canvas.get(0).height = canvasHeight
          if (!isInit) {
            self.offset.imgPosX = -canvas.height() / 4
            if (self.initRate) {
              self.offset.imgPosY = self.offset.imgPosX / self.initRate
            } else {
              self.offset.imgPosY = -canvas.width() / 4
            }
          }
          canvasContainer.height(canvasHeight)
          canvasContainer.width(canvasWidth)
          scale = canvasHeight / self.originSize[modal].canvasHeight
          canvasContainer.css({
            left: 0
          })
          $('head').append('<style>.canvas-phone:after{ width:calc(100% + ' + scale * self.originSize[modal].borderWidth + 'px) !important;height:calc(100% + ' + scale * self.originSize[modal].borderHeight + 'px) !important;top: calc(50% + ' + scale * self.originSize[modal].top + 'px) !important; }</style>')
        } else if (modal === 'mac') {
          canvasWidth = mainBox.width() * 2 / 5
          canvasHeight = Math.ceil(canvasWidth * 9 / 16)
          canvas.get(0).width = canvasWidth
          canvas.get(0).height = canvasHeight
          if (!isInit) {
            self.offset.imgPosX = -canvas.width() / 4
            if (self.initRate) {
              self.offset.imgPosY = self.offset.imgPosX / self.initRate
            } else {
              self.offset.imgPosY = -canvas.height() / 4
            }
          }
          canvasContainer.height(canvasHeight)
          canvasContainer.width(canvasWidth)
          scale = canvasWidth / self.originSize[modal].canvasWidth
          canvasContainer.css({
            left: 50 * scale + 'px'
          })
          $('head').append('<style>.canvas-mac:after{ width:calc(100% + ' + scale * self.originSize[modal].borderWidth + 'px) !important;height:calc(100% + ' + scale * self.originSize[modal].borderHeight + 'px) !important;left: calc(50% + ' + scale * self.originSize[modal].left + 'px);top: calc(50% + ' + scale * self.originSize[modal].top + 'px); }</style>')
        }
        return scale
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
    top: calc(50%);
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

  #dropdown1 li {
    margin: 0;
  }
</style>
<style>
  body {
    background-repeat: no-repeat;
    background-size: cover;
  }
  html {
    height: 100%;
  }
</style>
