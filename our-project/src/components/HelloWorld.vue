<template>
  <div class="hello">
    <!--<h1>{{ msg }}</h1>-->
    <h2>Essential Links</h2>


    <div class="col s2">
      <!--<i class="material-icons prefix">phone</i>-->
      <input type="color" class="flow-text" id="color-select" v-model="color" v-on:change="selectColor(color)">
      <label for="color-select" style="font-size: 20px">底色</label>
    </div>

    <div class="col s2 m2" v-bind:style="{ backgroundColor: color}">
      <p class="z-depth-2" style="color: #fff">color</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      color: '',
      selectColor: function (color) {
        console.log(color)
      }
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
  #color-select {
    border: 1px solid #aaa;
    width: 35px;
    height: 35px;
    border-radius: 5px;
    background-color: #fff;
    outline: none;
    cursor: pointer;
    padding: 2px 3px;
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
</style>
