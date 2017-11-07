<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/order/list' }">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
      <el-col :span="24" class="toolbar">
        <el-form :model="orderInfo" ref='editForm' label-width='100px'>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='订单编号：'>
                <el-input v-model="orderInfo.order_id" placeholder="不需填写" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品名称：'>
                <el-autocomplete
                  v-model="orderInfo.productName"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="商品名称"
                  @select="handleSelect"
                  style="width:100%;"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='商品单价：'>
                <el-input v-model.number="orderInfo.items[0].productPrice" placeholder="商品单价" width="111">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品数量：'>
                <el-input v-model.number="orderInfo.items[0].productQuantity" placeholder="商品数量"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='商品总价：'>
                <el-input v-bind:value="calGoodsTotalPrice" placeholder="商品总价" disabled>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品税费：'>
                <el-input v-model.number="orderInfo.goods_tax" placeholder="商品税费">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='物流费用：'>
                <el-input v-model.number="orderInfo.logistics_fees" placeholder="物流费用">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='订单总价：'>
                <el-input v-model="calOrderTotalPrice" placeholder="订单总价" disabled>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='购买用户：'>
                <el-input v-model="orderInfo.name" placeholder="购买用户"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='支付方式：'>
                <el-input v-model="orderInfo.pay_type" placeholder="支付方式"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='收货姓名：'>
                <el-input v-model="orderInfo.buyerName" placeholder="收货姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='收货电话：'>
                <el-input v-model="orderInfo.phone" placeholder="收货电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='收货地址：'>
                <el-cascader :options="addressOptions" v-model="orderInfo.consignee_address" @change="handleAddressChange" style='width:100%;margin-bottom:10px;'>
                </el-cascader>
                <br/>
                <el-input v-model="orderInfo.address_detail" placeholder="详细地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='身份证件：'>
                <el-input v-model="orderInfo.consignee_id" placeholder="收货人身份证"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='订单状态：'>
                <el-radio-group v-model='orderInfo.orderStatus'>
                  <el-radio :label="'1'">待支付</el-radio>
                  <el-radio :label="'2'">已取消</el-radio>
                  <el-radio :label="'3'">已支付</el-radio>
                  <el-radio :label="'4'">已发货</el-radio>
                  <el-radio :label="'5'">已完成</el-radio>
                  <el-radio :label="'6'">已评价</el-radio>
                  <el-radio :label="'7'">退款中</el-radio>
                  <el-radio :label="'8'">已退款</el-radio>
                  <el-radio :label="'9'">已删除</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='Ebay状态：'>
                <el-radio-group v-model='orderInfo.ebayStatus'>
                  <el-radio :label="'1'">待支付</el-radio>
                  <el-radio :label="'2'">已取消</el-radio>
                  <el-radio :label="'3'">已支付</el-radio>
                  <el-radio :label="'4'">已发货</el-radio>
                  <el-radio :label="'5'">已完成</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='物流状态：'>
                <el-radio-group v-model='orderInfo.logisticsStatus'>
                  <el-radio :label="'1'">海外仓已入库</el-radio>
                  <el-radio :label="'2'">海外仓已出库</el-radio>
                  <el-radio :label="'3'">清关中</el-radio>
                  <el-radio :label="'4'">派送中</el-radio>
                  <el-radio :label="'5'">已签收</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>


	<el-col :span='16' :offset='4'>
	  <label style="font-weight:bold;margin: 20px 0;">订单物流信息：</label><br/><br/>
	  <el-table :data="logistics" border style="width: 100%;margin-bottom:40px;">
	    <el-table-column prop="create_time" label="时间" width='180'></el-table-column>
	    <el-table-column prop="description" label="描述"></el-table-column>
	  </el-table>
	</el-col>



      </el-col>
    </el-col>
  </el-row>
</template>
<script>
import { regionData } from 'element-china-area-data'

export default {
  data() {
    return {
      orderInfo: {},
      logistics: [],
      addressOptions: regionData,
      selectedOptions: []
    }
  },
  methods: {
    handleAddressChange(val) {
      console.log(val)
    }

  },
  computed: {
  	calGoodsTotalPrice() {
  		return this.orderInfo.productQuantity * this.orderInfo.productPrice
  	},
  	calOrderTotalPrice() {
  		return this.calGoodsTotalPrice + this.orderInfo.goods_tax + this.orderInfo.logistics_fees
  	}
  },
  mounted() {
  	this.orderInfo = this.$route.params.order
  	this.logistics = this.orderInfo.logistics
  }
}

</script>
<style>
.demo-table-expand label {
  font-weight: bold;
}

</style>
