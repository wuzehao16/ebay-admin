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
                <el-input v-model="orderInfo.orderId" placeholder="不需填写" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品名称：'>
                <el-autocomplete v-model="orderInfo.productName" placeholder="商品名称" style="width:100%;"></el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='商品单价：'>
                <el-input v-model.number="orderInfo.productPrice" placeholder="商品单价" width="111">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品数量：'>
                <el-input v-model.number="orderInfo.productQuantity" placeholder="商品数量"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='物流费用：'>
                <el-input v-model.number="orderInfo.carriageFee" placeholder="物流费用">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品总价：'>
                <el-input v-bind:value="calGoodsTotalPrice" placeholder="商品总价" disabled>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='用户姓名：'>
                <el-input v-model="orderInfo.buyerName" placeholder="购买用户"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='订单总价：'>
                <el-input v-model="orderInfo.orderAmount" placeholder="订单总价" disabled>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='收货姓名：'>
                <el-input v-model="orderInfo.cneeName" placeholder="收货姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='收货电话：'>
                <el-input v-model="orderInfo.cneePhone" placeholder="收货电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='收货地址：'>
                <el-cascader :options="addressOptions" v-model="orderInfo.consignee_address" @change="handleAddressChange" style='width:100%;margin-bottom:10px;'>
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='详细地址：'>
                <el-input v-model="orderInfo.address_detail" placeholder="详细地址"></el-input>
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
          <label style="font-weight:bold;margin: 20px 0;">订单物流信息：</label>
          <br/>
          <br/>
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
import { regionData, TextToCode } from "element-china-area-data";
import { reqGetOrderDetail } from "../../api";
export default {
  data() {
    return {
      orderInfo: {},
      logistics: [],
      addressOptions: regionData,
      selectedOptions: []
    };
  },
  methods: {
    handleAddressChange(val) {

    },
    getOrderDetail(orderId) {
      let params = { orderNo: orderId };
      reqGetOrderDetail(params).then(res => {
        this.orderInfo = Object.assign({}, this.orderInfo, res.data.data.content[0]);

        this.handleAddressToCode();
      });
    },
    handleAddressToCode() {
      if (this.orderInfo.buyerAddress.length < 2) return
      let address = this.orderInfo.buyerAddress.split("@");
      if (address.length > 3) {
        this.orderInfo.consignee_address = [
          TextToCode[address[0]].code,
          TextToCode[address[0]][address[1]].code,
          TextToCode[address[0]][address[1]][address[2]].code
        ];
        this.orderInfo.address_detail = address[3];
      } else {
        this.orderInfo.consignee_address = [
          TextToCode[address[0]].code,
          TextToCode[address[0]][address[1]].code
        ];
        this.orderInfo.address_detail = address[2];
      }
    }
  },
  computed: {
    calGoodsTotalPrice() {
      return (
        this.orderInfo.productQuantity * this.orderInfo.productPrice
      );
    },
    calOrderTotalPrice() {
      return this.calGoodsTotalPrice + this.orderInfo.carriageFee;
    }
  },
  mounted() {
    let orderId = this.$route.params.order.orderNo;
    this.orderInfo.productQuantity = this.$route.params.order.productQuantity
    this.orderInfo.productPrice = this.$route.params.order.productPrice
    this.getOrderDetail(orderId);
    this.logistics = this.orderInfo.logistics;
  }
};

</script>
<style>
.demo-table-expand label {
  font-weight: bold;
}

</style>
