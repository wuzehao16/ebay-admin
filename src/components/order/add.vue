<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/order/list' }">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单新增</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
      <el-col :span="24" class="toolbarff">
        <el-form :model="orderInfo" ref='addForm' label-width='100px'>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='订单编号'>
                <el-input v-model="orderInfo.order_id" placeholder="不需填写" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品名称'>
                <!-- <el-input v-model="orderInfo.productName" placeholder="商品名称"></el-input> -->
                <el-autocomplete
                  v-model="orderInfo.productName"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="商品名称"
                  @select="handleSelect"
                  style="width:271px;"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='商品单价（元）'>
                <el-input v-model.number="orderInfo.items[0].productPrice" placeholder="商品单价" width="111"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='数量'>
                <el-input v-model.number="orderInfo.items[0].productQuantity" placeholder="数量"></el-input>
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
                <el-input v-model.number="orderInfo.goods_tax" placeholder="商品税费"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='物流费用（元）'>
                <el-input v-model.number="orderInfo.logistics_fees" placeholder="物流费用"></el-input>
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
                <el-input v-model="orderInfo.name" placeholder="购买用户"></el-input>
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
                <el-input v-model="orderInfo.buyerName" placeholder="收货姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='收货电话'>
                <el-input v-model="orderInfo.phone" placeholder="收货电话"></el-input>
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
            <el-col :span='18'>
              <el-form-item label='订单状态'>
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
            <el-col :span='18'>
              <el-form-item label='Ebay状态'>
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
            <el-col :span='18'>
              <el-form-item label='物流状态'>
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

          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16' :offset='10'>
			 	<el-button type="success" @click='addSubmit'>提交</el-button>
			    <el-button type="warning" @click='resetForm("addForm")'>重置</el-button>
			    <el-button type="info" @click='toOrderList'>返回列表</el-button>
		    </el-col>
          </el-row>


        </el-form>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
import util from "../../common/util";
import { reqAddOrder, reqProductName } from "../../api/index";
import { regionData } from "element-china-area-data";

export default {
  data() {
    return {
      orderInfo: {
        order_id: "",
        orderStatus: 0,
        order_source: 0,
        ebayNo: "",
        ebayStatus: 0,
        name: "",
        user_type: 0,
        create_time: "",
        goods_tax: 0,
        logistics_fees: 0,
        logisticsStatus: 0,
        pay_type: "微信支付",
        buyerName: "",
        phone: "",
        consignee_id: "",
        consignee_address: [],
        address_detail: "",
        address:"",
        openid:"1",
        items:[{
          id: 0,
          orderId: "",
          productIcon: "",
          productId: 0,
          productName: "",
          productPrice: 0,
          productQuantity: 0,
        }]
      },
      product: [],
      orderInfo_bak: {},
      addressOptions: regionData,
      selectedOptions: []
    };
  },
  methods: {
    handleAddressChange(val) {
      console.log(val);
    },
    addSubmit() {
      console.log(this.orderInfo);
      reqAddOrder(this.orderInfo).then(res => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
      });
    },
    resetForm(formName) {
      this.orderInfo = Object.assign({}, this.orderInfo_bak);
    },
    toOrderList() {
      this.$router.push("/order/list");
    },
    //远程拉取商品名列表
    querySearchAsync(queryString, cb) {
      var that = this;
      var product = this.product;
      var results = queryString ? fetch(queryString) : product;
      function fetch(queryString) {
        let params = { productNane: that.orderInfo.productName };
        reqProductName(params).then(res => {
          let Arr = res.data.data.content;
          let results = that.createStateFilter(Arr)
          cb(results);
        });
      }
    },
    createStateFilter(Arr) {
        let newArray = [];
        for (var n in Arr) {
          newArray[n] = {};
          newArray[n].value = Arr[n].productNane;
          newArray[n].id = Arr[n].id;
        }
        return newArray
    },
    handleSelect(item) {
      console.log(item);
      this.orderInfo.items[0].productId = item.id;
      this.orderInfo.items[0].productName = item.value;
    }
  },
  computed: {
    calGoodsTotalPrice() {
      return (this.orderInfo.items[0].productQuantity * this.orderInfo.items[0].productPrice
      ).toFixed(2);
    },
    calOrderTotalPrice() {
      return (parseFloat(this.calGoodsTotalPrice) +
        this.orderInfo.goods_tax +
        this.orderInfo.logistics_fees
      ).toFixed(2);
    }
  },
  mounted() {
    Object.assign(this.orderInfo_bak, this.orderInfo);
  }
};
</script>
<style>
.demo-table-expand label {
  font-weight: bold;
}
</style>
