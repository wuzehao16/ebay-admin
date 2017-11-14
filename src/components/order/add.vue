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
              <el-form-item label='订单编号：'>
                <el-input v-model="orderInfo.orderId" placeholder="不需填写" disabled></el-input>
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
              <el-form-item label='订单总价：'>
                <el-input v-model="calOrderTotalPrice" placeholder="订单总价" disabled>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
           <el-col :span='8'>
              <el-form-item label='用户电话：'>
                <el-autocomplete
                  v-model="orderInfo.phone"
                  :fetch-suggestions="phoneSearchAsync"
                  placeholder="用户电话"
                  @select="handleSelectphone"
                  style="width:100%;"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='用户姓名：'>
                <el-input v-model="orderInfo.name" placeholder="用户姓名"></el-input>
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
import { reqAddOrder, reqProductName ,reqGetUserList  } from "../../api/index";
import { regionData, CodeToText } from "element-china-area-data";

export default {
  data() {
    return {
      orderInfo: {
        orderId: "",
        orderStatus: 0,
        order_source: 0,
        ebayNo: "",
        ebayStatus: 0,
        userName: "",
        user_type: 0,
        create_time: "",
        goods_tax: 0,
        carriageFee: 0,
        logisticsStatus: 0,
        name: "",
        cneePhone: "",
        cneeIDcard: "",
        consignee_address: [],
        address_detail: "",
        address: "",
        openid: "",
        userPhone:"",
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
      product: [],
      orderInfo_bak: {},
      addressOptions: regionData,
      selectedOptions: []
    };
  },
  methods: {
    handleAddressChange(val) {
      // 
    },
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
    addSubmit() {
      this.addressCodeToaddress();
      
      reqAddOrder(this.orderInfo)
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.toOrderList();
          } else {
            this.$message({
              message: `${res.data.message}`,
              type: "success"
            });
          }
        })
        .catch(function(error) {
          
        });
    },
    resetForm(formName) {
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
        let params = { userPhone: that.orderInfo.phone };
        reqGetUserList(params).then(res => {
          let Arr = res.data.data.content;
          let results = that.createStateFilter2(Arr)
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
          newArray[n].userWxOpenid =Arr[n].userWxOpenid
        }
        return newArray
    },
    handleSelectphone(item){
      
      this.orderInfo.openid = item.userWxOpenid
    },
    //远程拉取商品名列表
    querySearchAsync(queryString, cb) {
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
    }
  },
  computed: {
    calGoodsTotalPrice() {
      return (this.orderInfo.items[0].productQuantity *
        this.orderInfo.items[0].productPrice
      ).toFixed(2);
    },
    calOrderTotalPrice() {
      return (parseFloat(this.calGoodsTotalPrice) + this.orderInfo.carriageFee
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
