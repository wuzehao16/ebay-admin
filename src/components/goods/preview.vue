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
		<iframe v-bind:src="'http://www.wstsoftware.com/popularize/pc_preview/' + product.id" frameborder="0"></iframe>
	</div>
  <div class="bt-box" v-if="product.auditStatus == '0'">
    <el-button type="primary" @click='auditSubmit("1")'>审核通过</el-button>
    <el-button type="warning" @click='auditSubmit("2")'>驳回</el-button>   
  </div>
  </el-row>  
</template>
<script>
import {reqSaveGoods} from '../../api'
export default {
  data() {
  	return {
  		product: {}
  	}
  },
  methods: {
    auditSubmit(val) {
        let info = '', resInfo = ''
        if (val == '1') {
          info = '确认审核通过该商品吗？'
          resInfo = '该商品已由您通过审核！'
        } else {
          info = '确认驳回该商品的提审吗？'
          resInfo = '该商品已被您驳回！'
        }
        this.product.auditStatus = val
        this.product.productId = this.product.id
        this.$confirm(info, '提示', {type: 'warning'}).then(() => {
          reqSaveGoods(this.product).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: resInfo
              })
              this.$router.push('/goods/list')              
            } else {
              this.$message.error(res.data.msg)              
            }
          }).catch((err) => {
            
          })
        }).catch((e) => {
          this.product.auditStatus = '0'
        })
    }
  },
  mounted() {
  	if (this.$route.params.product) {
  		this.product = this.$route.params.product
  	} else {
  		this.$router.push('/goods/list')
  	}
  }
}	
</script>

<style>
.bt-box {
  width: 365px;
  margin: 20px auto;
}
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