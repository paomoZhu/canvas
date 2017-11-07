<template>
  <div>


    <!--<div class="col s2">-->
      <!--<input type="color" class="flow-text" id="color-select" v-model="color" v-on:change="selectColor(color)">-->
      <!--<label for="color-select" style="font-size: 20px">底色</label>-->
    <!--</div>-->

    <!--<div class="col s2 m2" v-bind:style="{ backgroundColor: color}">-->
      <!--<p class="z-depth-2" style="color: #fff">color</p>-->
    <!--</div>-->

    <div class="row" v-for="tool in tools">
      <div class="col s3 m3">
        <div class="card">
          <div class="card-image">
            <img src="../assets/cover.jpg">
            <span class="card-title">Card Title</span>
          </div>
          <div class="card-content">
            <p>{{tool.name}}</p>
          </div>
          <div class="card-action">
            <a :href="tool.url">Go</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      tools: [
        {name: '纯色背景擦除器', id: 1, url: '/#/filter'},
        {name: '动画大师', id: 2, url: '/#/login'}
      ],
      color: '',
      selectColor: function (color) {
        console.log(color)
      }
    }
  },
  created: function () {
    this.color = '#ffa07e'
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
