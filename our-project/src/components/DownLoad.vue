<template>
  <div>
    <div class="logo row">
      <h2 class="col s12">
        一笔一画
      </h2>
    </div>

    <img src="../assets/bgpic.png" style="display: none" alt="">
    <div class="modal-bg"></div>

    <div class="row valign-wrapper" id="main" style="overflow: hidden;position: relative">
      <img id="load-pic-container" style="position: absolute; top: 9999px" src="">
      <div class="col s6 m6 valign" id="canvas-box">
        <div class="canvas-container" v-bind:class="{'canvas-mac': model == 'mac', 'canvas-phone': model == 'phone'}">
          <canvas id="canvas" class="valign" v-on:mousedown="bindMove($event)" v-on:mousewheel="aa($event)"></canvas>
        </div>
      </div>
      <div class="col s6 m6" style="position: relative;">
        <div class="row">
          <div id="ybyh-modal" class="modal" style="transition: all 200ms;">
            <div class="modal-content">
              <h5 style="color: #333">下载</h5>
              <div class="row clear-row-margin">
                <div class="col s12 left-align" style="color: #666">
                  图片名称:
                  <div class="input-field inline">
                    <input v-model="fileName" id="first_name2" type="text" class="validate">
                    <label class="active" for="first_name2">名称</label>
                  </div>
                </div>
              </div>
              <div class="row clear-row-margin">
                <div class="col s12 left-align" style="color: #666">
                  图片规格:
                  <div class="input-field inline">
                    <input id="pic-width" type="number" v-model="importWidth" v-on:change="setImport('height')" class="validate">
                    <label for="pic-width" v-bind:class="{active: !!importWidth}">宽度</label>
                  </div>
                  <i class="material-icons" style="color: #26a599;opacity: .5;font-size: 18px;">lock</i>
                  <div class="input-field inline">
                    <input id="pic-height" type="number" v-model="importHeight" v-on:change="setImport('width')" class="validate">
                    <label v-bind:class="{active: !!importHeight}" for="pic-height">高度</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <a href="javascript:void(0)" class="modal-action modal-close waves-effect waves-green btn-flat" v-on:click="download('jpg', closeModal, fileName)">确认</a>
              <a href="javascript:void(0)" class="modal-action modal-close waves-effect waves-green btn-flat" v-on:click="closeModal()">取消</a>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <div class="menu-container">
              <ul>
                <div class="block-scene"></div>
                <li class="menu-sub menu-sub-1">
                  <div class="inner">一</div>
                  <div class="outer">
                    <img src="../assets/upload.png">
                    <input type="file" style="cursor: pointer;position: absolute; top: 0; left: 0;opacity: 0;width: 100%; height: 100%;background-color: transparent !important;z-index: 2" id="load-pic" class="tooltipped" data-position="right" data-delay="0" data-tooltip="上传图片">
                  </div>
                </li>
                <li class="menu-sub menu-sub-2">
                  <div class="inner">笔</div>
                  <div class="outer">
                    <img v-show="model === 'mac'" v-on:click="changeModal()" src="../assets/phone-modal.png" class="tooltipped" data-position="right" data-delay="0" data-tooltip="手机模式">
                    <img v-show="model === 'phone'" v-on:click="changeModal()" src="../assets/mac-modal.png" class="tooltipped" data-position="right" data-delay="0" data-tooltip="电脑模式">
                  </div>
                </li>
                <li class="menu-sub menu-sub-3">
                  <div class="inner">画</div>
                  <div class="outer color-board">
                    <input type="color" class="flow-text" id="color-select" v-model="color" v-on:change="selectColor(deltaY, null, null, undefined, undefined, undefined, initRate)">
                    <img src="../assets/color-board.png" class="tooltipped" data-position="left" data-delay="0" data-tooltip="设置背景色">
                  </div>
                </li>
                <li class="menu-sub menu-sub-4">
                  <div class="inner">一</div>
                  <div class="outer horizontal">
                    <img src="../assets/download.png" v-on:click="openModal('ybyh-modal')" class="tooltipped" data-position="left" data-delay="0" data-tooltip="下载图片">
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="col s12">
            <div class="cover"></div>
          </div>
          <div class="col s12">
            <label>原画作者：</label>
            <span>QMeiZi</span>
          </div>
          <div class="col s12">
            <span>在职ui设计师，坐标杭州。喜欢摄影，户外徒步，寄情山水之间。</span>
          </div>
          <div class="col s12">
            <label>原画大小：</label>
            <span>{{originSize.pic.width}} · {{originSize.pic.height}}</span>
          </div>
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
        fileName: 'demo',
        uploadPic: false,
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
        openModal: function () {
          var ybyhModal = $('#ybyh-modal')
          var modalBg = $('.modal-bg')
          var canvas = $('#canvas')
          this.fileName = this.loadText === '上传本地图片' ? 'ybiyhua.jpg' : this.loadText
          this.importHeight = canvas.height()
          this.importWidth = canvas.width()
          ybyhModal.show()
          modalBg.show()
          setTimeout(function () {
            ybyhModal.addClass('modal-show')
            modalBg.addClass('modal-bg-show')
          }, 0)
        },
        closeModal: function () {
          $('#ybyh-modal').removeClass('modal-show')
          $('.modal-bg').removeClass('modal-bg-show')
          $('#ybyh-modal').hide()
          $('.modal-bg').hide()
        },
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
            ctx.drawImage(this.pic, imgPos.x + (offsetX || 0), imgPos.y + (offsetY || 0), tempInitheight / 2, tempInitWidth / 2)
          } else {
            tempInitheight = (typeof initRate !== 'undefined') ? (width / initRate) : height
            ctx.drawImage(this.pic, imgPos.x + (offsetX || 0), imgPos.y + (offsetY || 0), tempInitWidth / 2, tempInitheight / 2)
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
        download: function (type, callback) {
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
          var imgdata = canvas.get(0).toDataURL('image/' + type)
          function base64Img2Blob (code) {
            var parts = code.split(';base64,')
            var contentType = parts[0].split(':')[1]
            var raw = window.atob(parts[1])
            var rawLength = raw.length
            var uInt8Array = new Uint8Array(rawLength)
            for (var i = 0; i < rawLength; ++i) {
              uInt8Array[i] = raw.charCodeAt(i)
            }
            return new Blob([uInt8Array], {type: contentType})
          }
          function downloadFile (fileName, content) {
            var aLink = document.createElement('a')
            var blob = base64Img2Blob(content)  // new Blob([content]);
            aLink.download = fileName
            aLink.href = URL.createObjectURL(blob)
            var evt = document.createEvent('MouseEvents')
            evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            aLink.dispatchEvent(evt)
            if (callback) {
              callback()
            }
          }
          downloadFile(typeof this.fileName === 'undefined' ? 'ybiyhua.jpg' : this.fileName, imgdata)
        }
      }
    },
    created: function () {
      this.color = '#fffcf8'
      // this.pic.src = '../static/img/cover_1.8027e65.png'
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
        // 'background-image': 'url(../static/img/bgpic.429b3d0.png)'
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
        if (windowDom.height() < 300) {
          toolSlider.addClass('fix-tool')
        } else {
          toolSlider.removeClass('fix-tool')
        }
        // resize 不需要改变位置
        initCanvasBoxunderModal(self.model, 'noInit')
        init.call(self, self.deltaY, null, null, self.offset.imgPosX, self.offset.imgPosY, undefined, self.initRate)
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
    cursor: pointer;
  }

  .tool-slider li {
    margin: 2px 2px;
    width: 35px;
    height: 35px;
    display: block;
  }

  .color-board img {
    z-index: 2;
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

  .modal {
    display: none;
    position: fixed;
    left: 0;
    right: 0;
    background-color: #fafafa;
    padding: 0;
    max-height: 70%;
    width: 55%;
    margin: auto;
    overflow-y: auto;
    border-radius: 2px;
    will-change: top, opacity;
    z-index: 1003;
    opacity: 0.5;
    transform: scaleX(0.8);
    top: calc(10% + 30px);
    box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.3);
  }
  .modal-show {
    display: block;
    opacity: 1;
    transform: scaleX(1);
    top: calc(10%);
  }
  .clear-row-margin {
    margin: 0;
  }
  .btn-flat:hover {
    background-color: rgba(0,0,0,0.1);
    box-shadow: none;
  }
  .modal-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: #555;
    opacity: 0;
    display: none;
    transition: all 200ms;
  }
  .modal-bg-show {
    opacity: 0.5;
    display: block;
  }
  .menu-container {
    width: 56px;
    height: 56px;
    opacity: 0.5;
    margin: 0 auto;
    margin-bottom: 50px;
  }

  .menu-container ul {
    width: 100%;
    height: 100%;
    margin: 0;
    transition: all 200ms;
    position: relative;
  }

  .menu-container ul .block-scene {
    width: 100%;
    height: 100%;
    background-color: red;
    position: absolute;
    top: 0;
    left: 0;
    background-color: transparent;
  }

  .menu-container li {
    width: 50%;
    height: 50%;
    display: inline-block;
    margin: 0;
    float: left;
    box-sizing: border-box;
  }

  .menu-container ul:hover {
    cursor: default;
    transform: rotateZ(45deg);
  }
  .menu-container ul:hover .block-scene{
    width: 200%;
    height: 200%;
    transform: rotateZ(-45deg) translateY(-35%);
  }
  .menu-container ul:hover .menu-sub .outer {
    cursor: pointer;
    line-height: calc(1.4 * 28px);
    z-index: 9;
    border-color: #26a599 !important;
    opacity: 1;
    border-width: 2px !important;
  }
  .menu-container ul:hover .menu-sub .inner {
    opacity: 0;
  }

  .menu-container ul:hover .menu-sub{
    border-color: #26a599;
    border-width: 2px !important;
  }

  .menu-container ul:hover .menu-sub-1 {
    transform: translate(-4px, -4px);
    border-bottom-right-radius: 5px;
  }

  .menu-container ul:hover .menu-sub-1 .outer {
    border: 1px solid;
    border-bottom: none;
    width: calc(1.4 * 28px);
    height: calc(1.4 * 28px);
    transform: rotate(-45deg) translateY(calc(-1.4 / 4 * 28px));
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .menu-container ul:hover .menu-sub-2 {
    transform: translate(4px, -4px);
    border-bottom-left-radius: 5px;
  }

  .menu-container ul:hover .menu-sub-2 .outer {
    border: 1px solid;
    border-left: none;
    width: calc(1.4 * 28px);
    height: calc(1.4 * 28px);
    transform: rotate(-45deg) translateX(calc(1.4 / 4 * 28px));
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .menu-container ul:hover .menu-sub-3 {
    transform: translate(-4px, 4px);
    border-top-right-radius: 5px;
  }

  .menu-container ul:hover .menu-sub-3 .outer {
    border: 1px solid;
    border-right: none;
    width: calc(1.4 * 28px);
    height: calc(1.4 * 28px);
    transform: rotate(-45deg) translateX(calc(-1.4 / 4 * 28px));
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .menu-container ul:hover .menu-sub-4 {
    transform: translate(4px, 4px);
    border-top-left-radius: 5px;
  }

  .menu-container ul:hover .menu-sub-4 .outer {
    border: 1px solid;
    border-top: none;
    width: calc(1.4 * 28px);
    height: calc(1.4 * 28px);
    transform: rotate(-45deg) translateY(calc(1.4 / 4 * 28px));
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .menu-sub {
    position: relative;
  }

  .menu-sub .inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 28px;
    z-index: 8;
    box-sizing: border-box;
  }

  .menu-sub .outer {
    position: absolute;
    line-height: 28px;
    z-index: 5;
    height: 100%;
    opacity: 0;
    box-sizing: border-box;
    overflow: hidden;
    padding: 5px;
    transition: all 200ms;
  }

  .menu-sub .outer img {
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  .menu-sub .outer img:hover {
    background-color: #cdcdcd;
  }
  .menu-sub .outer img:active {
    background-color: #aaa;
  }

  .menu-sub-1 {
    border-right: 1px solid #999;
    border-bottom: 1px solid #999;
  }
  .menu-sub-1 .outer {
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }

  .menu-sub-2 {
    border-left: 1px solid #999;
    border-bottom: 1px solid #999;
  }
  .menu-sub-2 .outer {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }

  .menu-sub-3 {
    border-right: 1px solid #999;
    border-top: 1px solid #999;
  }
  .menu-sub-3 .outer {
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .menu-sub-4 {
    border-left: 1px solid #999;
    border-top: 1px solid #999;
  }
  .menu-sub-4 .outer {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .cover {
    width: 60px;
    height: 60px;
    overflow: hidden;
    background-image: url(../assets/touxiang.png);
    background-position: -137px -71px;
    background-repeat: no-repeat;
    background-size: 200px 292px;
    display: inline-block;
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
