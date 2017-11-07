<template>
  <div class="hello container" id="container">
    <div class="row">
    <!-- 页面内容放在这里 -->
      <div id="bg-pic" class="col s12 row">
         <img class="center-align" v-bind:class="{ 'height-fix': origin === 'height', 'width-fix': origin === 'width'}" src="../assets/cover_1.png">
      </div>
    </div>
    <div class="row" style="position: relative">
      <form class="col s4 " id="code-input">
        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">loyalty</i>
            <input placeholder="请输入图片提取码～" v-model="code" id="icon_prefix" type="text" class="validate">
            <label class="active" for="icon_prefix">提取码</label>
          </div>
        </div>
        <a href="#" id="send-code" v-bind:class="{'active' : !!code == true}">
          <i class="material-icons">navigation</i>
        </a>
      </form>
      <div class="col s12 center-align" id="author">
        <span>—&nbsp;</span> {{author}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FilterColor',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        origin: 'height',
        author: 'QMeiZi',
        code: ''
      }
    },
    mounted: function () {
      var body = $('body')
      var bgArea = $('#bg-pic')
      var inputArea = $('#code-input')
      var self = this
      body.css({
        'background-color': 'rgba(255, 255, 240, 0.44)'
      })
      resize()
      function resize () {
        var windowHeight = $(window).height()
        var windowWidth = $(window).width()
        if (windowHeight > windowWidth) {
          self.origin = 'width'
        } else {
          self.origin = 'height'
        }
        body.width($(window).width())
        body.height($(window).height())
        body.css({
          'margin-top': '-60px'
        })
        bgArea.height($(window).height() / 2)
        inputArea.height($(window).height() / 2)
      }
      $(window).bind('resize', function () {
        resize()
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

  .row {
    margin-bottom: 0;
  }

  #bg-pic img {
    position: absolute;
    bottom: 0;
    left: 0;
    margin-left: 50%;
    transform: translateX(-50%);
  }

  #bg-pic {
    position: relative;
  }

  #code-input {
    display: inline-block;
    position: relative;
    top: 120px;
    margin-left: 50%;
    transform: translateX(-50%);
    height: auto !important;
  }

  #code-input .active {
    cursor: pointer;
    color: #26a69a;
  }

  #code-input .active:hover {
    color: #1ebfb0;
  }

  #author {
    position: absolute;
    left: 0;
    top: 40px;
    margin-left: 50%;
    transform: translateX(-50%);
  }

  #author span {
    position: relative;
    top: -2px
  }

  #send-code {
    transform: rotateZ(90deg);
    position: absolute;
    right: 0;
    top: 0;
    margin: 12px -19px 0 0;
    font-size: 30px !important;
    color: #ccc;
    cursor: default;
  }

  #send-code i {
    font-size: 30px;
  }

  .width-fix{
    width: 100%;
    height: auto;
  }

  .height-fix {
    width: auto;
    height: 100%;
  }
</style>
