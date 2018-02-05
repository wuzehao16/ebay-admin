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
        <el-form :model="orderInfo" ref='editForm' label-width='100px' :rules="rules">
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='订单编号：'>
                <el-input v-model="orderInfo.orderNo" placeholder="不需填写" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品名称：'>
                <el-input v-model="orderInfo.productName" placeholder="不需填写" disabled></el-input>
<!--                 <el-autocomplete
                  v-model="orderInfo.productName"
                  placeholder="商品名称"
                  :fetch-suggestions="querySearchAsync"
                  @select="handleSelect"
                  style="width:100%;"
                ></el-autocomplete> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='商品单价：' prop='items[0].productPrice' :rules="[{ required: true, message: '商品单价不能为空'}, { type: 'number', message: '商品单价必须为数字值'}]">
                <el-input v-model.number="orderInfo.productPrice" placeholder="商品单价" width="111">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品数量：' prop="items[0].productQuantity" :rules="[{ required: true, message: '商品数量不能为空'}, { type: 'number', message: '商品数量必须为数字值'}]">
                <el-input v-model.number="orderInfo.productQuantity" placeholder="商品数量"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='物流费用：' prop="carriageFee" :rules="[{ required: true, message: '物流费用不能为空'}, { type: 'number', message: '物流费用必须为数字值'}]">
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
                <!-- <el-autocomplete
                  v-model="orderInfo.userPhone"
                  :fetch-suggestions="phoneSearchAsync"
                  placeholder="用户电话"
                  @select="handleSelectphone"
                  style="width:100%;"
                ></el-autocomplete> -->
                <el-input v-model="orderInfo.buyerName" placeholder="用户姓名" disabled></el-input>
              </el-form-item>
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
              <el-form-item label='收货电话：' prop="buyerPhone" >
                <el-input v-model.number="orderInfo.buyerPhone" placeholder="收货电话"></el-input>
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

          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
                <el-col :span='16' :offset='10'>
            <el-button type="success" @click='editSubmit'>提交</el-button>
              <!-- <el-button type="warning" @click='resetOrder'>重置</el-button> -->
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
import {
  reqEditOrder,
  reqProductName,
  reqGetOrderDetail,
  reqGetUserList
} from "../../api";
import { regionData, TextToCode, CodeToText } from "element-china-area-data";

export default {
  data() {
    var validatephone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号不能为空"));
      } else if (!(/^1[3|4|5|8]\d{9}$/).test(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    return {
      orderInfo: {
        userPhone: "",
        productName: "",
        items: [
          {
            id: 0,
            orderId: "",
            productIcon: "",
            productId: 0,
            productName: "",
            productPrice: 0,
            productQuantity: 0
          }
        ]
      },
      orderInfo_bak: {},
      addressOptions: regionData,
      selectedOptions: [],
      rules: {
        buyerPhone: [{ validator: validatephone, trigger: "blur" }]
      }
    };
  },
  methods: {
    handleAddressChange(val) {},
    addressCodeToaddress() {
      if (
        this.orderInfo.consignee_address &&
        this.orderInfo.consignee_address.length < 1
      )
        return;
      this.orderInfo.address =
        CodeToText[this.orderInfo.consignee_address[0]] +
        "@" +
        CodeToText[this.orderInfo.consignee_address[1]] +
        "@" +
        CodeToText[this.orderInfo.consignee_address[2]];
      this.orderInfo.address += "@" + this.orderInfo.address_detail;
    },
    editSubmit() {
      // 编辑提交
      this.addressCodeToaddress();
      this.orderInfo.items = this.orderInfo.orderInfo;
      this.orderInfo.orderMasterId = this.orderInfo.id;
      this.orderInfo.buyerAddress = this.orderInfo.address;
      this.orderInfo.cneeAddress = this.orderInfo.address;
      reqEditOrder(this.orderInfo).then(res => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.toOrderList();
      });
    },
    resetOrder() {
      this.orderInfo = Object.assign({}, this.orderInfo_bak);
    },
    toOrderList() {
      this.$router.push("/order/list");
    },
    phoneSearchAsync(queryString, cb) {
      //远程拉取买家名列表
      var that = this;
      var product = this.product;
      var results = queryString ? fetch(queryString) : product;
      function fetch(queryString) {
        let params = { userPhone: that.orderInfo.userPhone };
        reqGetUserList(params).then(res => {
          let Arr = res.data.data.content;
          let results = that.createStateFilter2(Arr);
          cb(results);
        });
      }
    },
    createStateFilter2(Arr) {
      let newArray = [];
      for (var n in Arr) {
        newArray[n] = {};
        newArray[n].value = Arr[n].userPhone;
        newArray[n].id = Arr[n].id;
        newArray[n].userWxOpenid = Arr[n].userWxOpenid;
      }
      return newArray;
    },
    handleSelectphone(item) {
      this.orderInfo.openid = item.userWxOpenid;
    },
    querySearchAsync(queryString, cb) {
      //远程拉取商品名列表
      var that = this;
      var product = this.product;
      var results = queryString ? fetch(queryString) : product;
      function fetch(queryString) {
        let params = { productName: that.orderInfo.productName };
        reqProductName(params).then(res => {
          let Arr = res.data.data.content;
          let results = that.createStateFilter(Arr);
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
      return newArray;
    },
    handleSelect(item) {
      this.orderInfo.items[0].productId = item.id;
      this.orderInfo.items[0].productName = item.value;
    },
    getOrderDetail(orderId) {
      //获取订单详情
      let params = { orderNo: orderId };
      reqGetOrderDetail(params).then(res => {
        this.orderInfo = Object.assign(
          {},
          this.orderInfo,
          res.data.data.content[0]
        );
        this.handleAddressToCode();
      });
    },
    handleAddressToCode() {
      //地址转code

      if (this.orderInfo.cneeAddress.length < 2) return;
      let address = this.orderInfo.cneeAddress.split("@");
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
    },
    getProductId() {
      let params = { productName: this.orderInfo.productName };
      reqProductName(params).then(res => {});
    }
  },
  computed: {
    calGoodsTotalPrice() {
      return this.orderInfo.productQuantity * this.orderInfo.productPrice;
    },
    calOrderTotalPrice() {
      return this.calGoodsTotalPrice + this.orderInfo.carriageFee;
    }
  },
  mounted() {
    let order = this.$route.params.order
    if (order) {
      let orderId = order.orderNo
      this.orderInfo.productName = order.productName
      this.orderInfo.productQuantity = order.productQuantity
      this.orderInfo.productPrice = order.productPrice
      this.getOrderDetail(orderId)
      Object.assign(this.orderInfo_bak, this.$route.params.order)
    } else {
      this.$router.push('/order/list')
    }
  }
};
</script>
<style>
.demo-table-expand label {
  font-weight: bold;
}
</style>
