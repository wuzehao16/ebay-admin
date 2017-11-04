<template>

  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品预览</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
	<div class="phone" :style="{'background-image': 'url(' + require('../../assets/images/phone.png') + ')'}">
	<!-- app域名 -->
		<iframe v-bind:src="'http://localhost:8089/?pc_preview=' + id + '#/product/detail' " frameborder="0"></iframe>
	</div>
  </el-row>  

</template>
<script>
export default {
  data() {
  	return {
  		id: 'xx'
  	}
  },
  mounted() {
  	if (this.$route.params.productId) {
  		this.id = this.$route.params.productId
  	} else {
  		this.$router.push('/goods/list')
  	}
  }
}	
</script>

<style>
.phone {
    margin: 60px 20px 0;
    background-repeat: no-repeat;
    background-size: 100%;
    height: 100%;
    padding: 104px 16px;
    box-sizing: border-box;
    width: 365px;
}
.phone iframe {
	background: #fff;
	height: 580px;
	width: 100%;
}
</style>