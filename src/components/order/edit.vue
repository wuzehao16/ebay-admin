<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/order/list' }">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
      <el-col :span="24" class="toolbarff">
        <el-form :model="orderInfo" ref='editForm' label-width='100px'>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='订单编号'>
                <el-input v-model="orderInfo.order_id" placeholder="订单编号" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品名称'>
                <el-input v-model="orderInfo.productName" placeholder="商品名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='商品单价（元）'>
                <el-input v-model="orderInfo.productPrice" placeholder="商品单价"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='数量'>
                <el-input v-model="orderInfo.productQuantity" placeholder="数量"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='商品总价（元）'>
                <el-input v-bind:value="calGoodsTotalPrice" placeholder="商品总价" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品税费（元）'>
                <el-input v-model="orderInfo.goods_tax" placeholder="商品税费"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='物流费用（元）'>
                <el-input v-model="orderInfo.logistics_fees" placeholder="物流费用"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='订单总价（元）'>
                <el-input v-model="calOrderTotalPrice" placeholder="订单总价" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='购买用户'>
                <el-input v-model="orderInfo.user_name" placeholder="购买用户"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='支付方式'>
                <el-input v-model="orderInfo.pay_type" placeholder="支付方式"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='收货姓名'>
                <el-input v-model="orderInfo.consignee" placeholder="收货姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='收货电话'>
                <el-input v-model="orderInfo.consignee_tel" placeholder="收货电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='收货人身份证'>
                <el-input v-model="orderInfo.consignee_id" placeholder="收货人身份证"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='收货地址'>
                <el-cascader :options="addressOptions" v-model="orderInfo.consignee_address" @change="handleAddressChange" style='width:100%;margin-bottom:10px;'>
                </el-cascader>
                <br/>
                <el-input v-model="orderInfo.address_detail" placeholder="详细地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='订单状态'>
                <el-radio-group v-model='orderInfo.order_status'>
                  <el-radio :label="0">待付款</el-radio>
                  <el-radio :label="1">待发货</el-radio>
                  <el-radio :label="2">待签收</el-radio>
                  <el-radio :label="3">已签收</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='Ebay状态'>
                <el-radio-group v-model='orderInfo.ebay_status'>
                  <el-radio :label="0">待付款</el-radio>
                  <el-radio :label="1">已付款</el-radio>
                  <el-radio :label="2">已发货</el-radio>
                  <el-radio :label="3">已签收</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='物流状态'>
                <el-radio-group v-model='orderInfo.logistics_status'>
                  <el-radio :label="0">海外仓已入库</el-radio>
                  <el-radio :label="1">海外仓已出库</el-radio>
                  <el-radio :label="2">清关中</el-radio>
                  <el-radio :label="3">派送中</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16' :offset='10'>
			 	<el-button type="success" @click='editSubmit'>提交</el-button>
			    <el-button type="warning" @click='resetOrder'>重置</el-button>
			    <el-button type="info" @click='toOrderList'>返回列表</el-button>
		    </el-col>
          </el-row>


        </el-form>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
import util from '../../common/util'
import { reqEditOrder } from '../../api';
import { regionData } from 'element-china-area-data'

export default {
  data() {
    return {
      orderInfo: {},
      orderInfo_bak: {},

      addressOptions: regionData,
      selectedOptions: []
    }
  },
  methods: {
    handleAddressChange(val) {
      console.log(val)
    },
    editSubmit() {
      // 编辑提交
    	reqEditOrder(this.orderInfo).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
    	})
    },
    resetOrder() {
    	this.orderInfo = Object.assign( {}, this.orderInfo_bak)    	
    },
    toOrderList() {
    	this.$router.push('/order/list')
    }

  },
  computed: {
  	calGoodsTotalPrice() {
  		return (this.orderInfo.productQuantity * this.orderInfo.productPrice).toFixed(2)
  	},
  	calOrderTotalPrice() {
  		return (parseFloat(this.calGoodsTotalPrice) + this.orderInfo.goods_tax + this.orderInfo.logistics_fees).toFixed(2)
  	}
  },
  mounted() {
  	this.orderInfo = this.$route.params.order
	Object.assign( this.orderInfo_bak, this.$route.params.order )
  }
}

</script>
<style>
.demo-table-expand label {
  font-weight: bold;
}

</style>
