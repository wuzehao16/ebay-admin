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
          <el-row type="flex" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='订单编号：'>
                <el-input v-model="orderInfo.orderNo" placeholder="不需填写" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品名称：'>
                <el-input v-model="orderInfo.productName" placeholder="不需填写" disabled></el-input>
                <!--         <el-autocomplete
                  v-model="orderInfo.productName"
                  placeholder="商品名称"
                  :fetch-suggestions="querySearchAsync"
                  @select="handleSelect"
                  style="width:100%;"
                ></el-autocomplete> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='商品单价：' prop='productPrice' :rules="[{ required: true, message: '商品单价不能为空'}, { type: 'number', message: '商品单价必须为数字值'}]">
                <el-input v-model.number="orderInfo.productPrice" placeholder="商品单价" width="111">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品数量：' prop="productQuantity" :rules="[{ required: true, message: '商品数量不能为空'}, { type: 'number', message: '商品数量必须为数字值'}]">
                <el-input v-model.number="orderInfo.productQuantity" placeholder="商品数量"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='物流费用：' prop="carriageFee" :rules="[{ required: true, message: '物流费用不能为空'}, { type: 'number', message: '物流费用必须为数字值'}]">
                <el-input v-model.number="orderInfo.carriageFee" placeholder="物流费用">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='税费：' prop="taxFee" :rules="[{ required: true, message: '税费不能为空'}, { type: 'number', message: '税费必须为数字值'}]">
                <el-input v-model.number="orderInfo.taxFee" placeholder="税费">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='商品总价：'>
                <el-input v-bind:value="calGoodsTotalPrice" placeholder="商品总价" disabled>
                  <template slot="append">元</template>
                </el-input>
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
          <el-row type="flex" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='用户姓名：'>
                <!--       <el-autocomplete
                  v-model="orderInfo.userPhone"
                  :fetch-suggestions="phoneSearchAsync"
                  placeholder="用户电话"
                  @select="handleSelectphone"
                  style="width:100%;"
                ></el-autocomplete> -->
                <el-input v-model="orderInfo.buyerName" placeholder="用户姓名" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8' >
              <div v-if="orderInfo.productAttr && JSON.parse(orderInfo.productAttr) && JSON.parse(orderInfo.productAttr).length>0">
                <el-form-item :label='JSON.parse(orderInfo.productAttr)[0].key' >
                  <el-input v-model="JSON.parse(orderInfo.productAttr)[0].value" disabled>
                    <!-- <template slot="append">元</template> -->
                  </el-input>
                </el-form-item>
              </div>

            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='收货人姓名：'>
                <el-input v-model="orderInfo.cneeName" placeholder="收货姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='收货人电话：' prop="buyerPhone">
                <el-input v-model.number="orderInfo.cneePhone" placeholder="收货电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='收货人地址：'>
                <el-cascader :options="addressOptions" v-model="selectedOptions" @change="handleAddressChange"  size="large" style='width: 100%;'>
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='详细地址：'>
                <el-input v-model="orderInfo.address_detail" placeholder="详细地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='物流编号：'>
                <el-input v-model="orderInfo.logisticsNo" placeholder="物流编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter='20'>
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
          <el-row type="flex" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='Ebay状态：'>
                <el-radio-group v-model='orderInfo.ebayStatus'>
                  <el-radio :label="'-1'">未下单</el-radio>
                  <el-radio :label="'1'">待支付</el-radio>
                  <el-radio :label="'2'">已取消</el-radio>
                  <el-radio :label="'3'">已支付</el-radio>
                  <el-radio :label="'4'">已发货</el-radio>
                  <el-radio :label="'5'">已完成</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='物流状态：'>
                <el-radio-group v-model='orderInfo.logisticsStatus'>
                  <el-radio :label="'-1'">未发货</el-radio>
                  <el-radio :label="'1'">海外仓已入库</el-radio>
                  <el-radio :label="'2'">海外仓已出库</el-radio>
                  <el-radio :label="'3'">清关中</el-radio>
                  <el-radio :label="'4'">派送中</el-radio>
                  <el-radio :label="'5'">已签收</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter='20' v-if='!$route.params.isDetail'>
            <el-col :span='16' :offset='10'>
              <el-button type="success" @click='editSubmit'>提交</el-button>
              <el-button type="info" @click='toOrderList'>返回列表</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-col :span='16' :offset='4' v-if='$route.params.isDetail'>
          <label style="font-weight:bold;margin: 20px 0;">订单物流信息：</label>
          <br/>
          <br/>
          <el-table :data="logistics" border style="width: 100%;margin-bottom:40px;">
            <el-table-column prop="trackingTime" label="时间" width='180'></el-table-column>
            <el-table-column prop="trackingMessage" label="描述"></el-table-column>
          </el-table>
        </el-col>
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
  reqGetUserList,
  reqLogistics,
  reqAddressJson
} from "../../api";

export default {
  data() {
/*    var validatephone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号不能为空"));
      } else if (!(/^1[3|4|5|8]\d{9}$/).test(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };*/
    return {
      logistics: [],
      orderInfo: {
        carriageFee: 0,
        productPrice: 0,
        productQuantity: 0
      },
      orderInfo_bak: {},
      addressOptions: [],
      selectedOptions: [],
      rules: {
        // buyerPhone: [{ validator: validatephone, trigger: "blur" }]
      }
    };
  },
  methods: {
    handleAddressChange(val) {
      // console.log(val)
    },
    editSubmit() {
      // 编辑提交
      this.orderInfo.items = this.orderInfo.orderInfo;
      this.orderInfo.orderMasterId = this.orderInfo.id;
      this.orderInfo.buyerAddress = this.orderInfo.address;
      this.orderInfo.cneeAddress = this.selectedOptions.join('@') +
        '@' + this.orderInfo.address_detail;
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
      reqGetOrderDetail({ orderId: orderId }).then(res => {
        let r = res.data.data
        if (!r.ebayStatus) r.ebayStatus = '-1'
        if (!r.logisticsStatus) r.logisticsStatus = '-1'
        const id = this.orderInfo.id;
        this.orderInfo = Object.assign({}, r, r.orderDetailList[0])
        this.orderInfo.id = r.id;
        let addr = r.cneeAddress.split('@')
        this.selectedOptions = addr.slice(0, 4)
        this.orderInfo.address_detail = addr[4]


        console.log('nono:', this.orderInfo)

        reqAddressJson().then(res => {
          let fir = []
          for (let i of Object.entries(res.data)) {
            let sec = []
            for (let j of Object.entries(i[1])) {
              let thi = []
              for (let k of Object.entries(j[1])) {
                let four = []
                for (let m of k[1]) {
                  four.push({
                    value: m,
                    label: m
                  })
                }
                thi.push({
                  value: k[0],
                  label: k[0],
                  children: four
                })
              }
              sec.push({
                value: j[0],
                label: j[0],
                children: thi
              })
            }
            fir.push({
              value: i[0],
              label: i[0],
              children: sec
            })
          }
          this.addressOptions = fir
        })
      });
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
      this.getOrderDetail(orderId)
      Object.assign(this.orderInfo_bak, this.$route.params.order)

      if (this.$route.params.isDetail) {
//         17091924161
        reqLogistics({ logisticsNo: order.logisticsNo }).then((res) => {
          let r = res.data.data
          if (typeof r == 'object') {
            this.logistics = r
          }
        }).catch(err => {
          console.log('err')
        })
      }
    } else {
      this.$router.push('/order/list')
    }
  }
};

</script>
