<template>
  <!--<div class="hello">-->
  <!--<h1>{{ msg }}</h1>-->
  <!--<h2>Essential Links</h2>-->


  <!--<div class="col s2">-->
  <!--<input type="color" class="flow-text" id="color-select" v-model="color" v-on:change="selectColor(color)">-->
  <!--<label for="color-select" style="font-size: 20px">底色</label>-->
  <!--</div>-->

  <!--<div class="col s2 m2" v-bind:style="{ backgroundColor: color}">-->
  <!--<p class="z-depth-2" style="color: #fff">color</p>-->
  <!--</div>-->
  <!--</div>-->

  <!--<div class="row">-->
  <!--&lt;!&ndash; 页面内容放在这里 &ndash;&gt;-->
  <!--<div class="col s6 row">-->
  <!--<div class="col s12 valign-wrapper">-->
  <!--<img class="col s12 valign" src="../assets/cover.png">-->
  <!--</div>-->
  <!--</div>-->
  <!--<div class="col s6">2</div>-->
  <!--</div>-->
  <div id="filterColor">
    <input type="file" id="file" v-on:change="loadFile($event)">
    <canvas id="canvas" width="1280" height="859" style="border: 1px solid"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'FilterColor',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        loadFile: function (file) {
          console.log(file.target.files[0])
        }
      }
    },
    mounted: function () {
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')
      let img = new Image()
      img.src = 'static/img/cover.5ad5e16.jpg'
      img.onload = function () {
        console.log(img.width, img.height)
        ctx.drawImage(img, 0, 0)
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        for (var i = 0, len = imgData.data.length; i < len; i += 4) {
          if (imgData.data[i] === 255 && imgData.data[i + 1] === 255 && imgData.data[i + 2] === 255) {
            imgData.data[i + 3] = 0
          }
        }
        console.log(imgData)
        ctx.putImageData(imgData, 0, 0)
      }
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
  /*#color-select {*/
  /*border: 1px solid #aaa;*/
  /*width: 35px;*/
  /*height: 35px;*/
  /*border-radius: 5px;*/
  /*background-color: #fff;*/
  /*outline: none;*/
  /*cursor: pointer;*/
  /*padding: 2px 3px;*/
  /*}*/
  /*#color-select::-webkit-color-swatch-wrapper{*/
  /*padding: 1px 0;*/
  /*}*/
  /*#color-select::-webkit-color-swatch {*/
  /*border: 0;*/
  /*border-radius: 5px;*/
  /*}*/
  /*#color-select:hover {*/
  /*border-color: #777;*/
  /*}*/
  /*#color-select:active {*/
  /*border-color: #777;*/
  /*}*/
</style>
