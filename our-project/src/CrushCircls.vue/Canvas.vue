<template>
  <div>
    {{msg}}
    <canvas id="canvas" width="800" height="450"></canvas>
    <div id="scoreboard" class="floatingControls">0</div>

    <div id="controls" class="floatingControls">
      初始速度（m/s)
      <output id="launchVelocityOutput"></output> m/s <br>

      初始角度
      <output id="launchAngleOutput"></output> degrees <br>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Canvas',
    data () {
      return {
        msg: 'aaa'
      }
    },
    created: function () {
      this.msg = '#ffa07e'
    },
    mounted: function () {
      console.log(1)
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

  output {
    color: blue;
  }

  .floatingControls {
    background: rgba(0, 0, 0, 0.1);
    border: thin solid skyblue;
    box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 4px;
    padding: 15px;
    font-size: 15px;
  }

  #canvas {
    background: skyblue;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  #scoreboard {
    background: rgba(255, 255, 255, 0.5);
    position: absolute;
    left: 755px;
    top: 20px;
    color: blue;
    font-size: 18px;
    padding: 5px;
  }

  #controls {
    position: absolute;
    left: 285px;
    top: 20px;
  }
</style>
