<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
body{
  padding:0px;
  margin:0px auto;
}
a{
  text-decoration:none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
.el-table__body-wrapper.el-table__body tr.current-row>td {
    background: #edf7ff!important;
}
.el-pagination{
  float: left !important;
  margin-top: 10px;
}
.el-input.is-disabled .el-input__inner {
    background-color: #eef1f6;
    border-color: #d1dbe5;
    color: #000 !important;
    cursor: not-allowed;
}
.el-textarea.is-disabled .el-textarea__inner {
    color: #000 !important;
}
.wrap-pic {
  margin-bottom: 10px;
  width: 100%;
  height: 150px;
  background: #d1dbe5;
  overflow: hidden;
  position: relative;
  input {
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    opacity: 0;
  }
  p {
    text-align: center;
    color: #8391a5;
  }
  img {
    position: absolute;
    top: 0;
    width: 100%;
  }
}
</style>
