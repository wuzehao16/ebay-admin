<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/orderException/list' }">订单异常</el-breadcrumb-item>
        <el-breadcrumb-item>异常订单新增</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
      <el-col :span="24" class="toolbarff">
        <el-form :model="exOrderInfo" ref='addExOrderForm' label-width='100px' :rules="rules">
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='订单编号' prop="orderNo">
                <el-autocomplete class="inline-input" v-model="exOrderInfo.orderNo" :fetch-suggestions="querySearchAsync" placeholder="订单编号" @select="handleSelect"></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品名称'>
                <el-input v-model="orderInfo.productName" placeholder="商品名称" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!--           <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='卖家邮箱'>
                <el-input v-model="exOrderInfo.seller_email" placeholder="卖家邮箱" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='卖家电话'>
                <el-input v-model="exOrderInfo.sellPhone" placeholder="卖家电话" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='买家姓名'>
                <el-input v-model="orderInfo.buyerName" placeholder="买家姓名" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='买家电话'>
                <el-input v-model="orderInfo.buyerPhone" placeholder="买家电话" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='异常类型' prop="errorType">
                <el-select v-model.number="exOrderInfo.errorType" placeholder="异常类型">
                  <el-option v-for="item in exTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='订单总价（元）'>
                <el-input v-model="orderInfo.orderAmount" placeholder="订单总价" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='异常状态' prop='errorStatus'>
                <el-select v-model="exOrderInfo.errorStatus" placeholder="异常状态">
                  <el-option v-for="item in exStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='处理人' prop='handerby'>
                <el-input placeholder="处理人" v-model="exOrderInfo.handerby">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='异常描述' prop='errorMemo'>
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" v-model="exOrderInfo.errorMemo">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16' :offset='10'>
              <el-button type="success" @click='AddSubmit'>提交</el-button>
              <el-button type="info" @click='toOrderList'>返回列表</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
import { reqNumToList, reqAddExOrder, reqGetOrderDetail } from "../../api/index";

export default {
  data() {
    return {
      exOrderInfo: {
        orderNo: "",
        errorStatus: "",
        errorType: "",
        handerby: "",
        errorMemo: ""
      },
      orderInfo: {

      },
      exTypeOptions: [{
          value: 0,
          label: "系统异常"
        },
        {
          value: 1,
          label: "Ebay缺货"
        },
        {
          value: 2,
          label: "卖家取消订单"
        }
      ],
      exStatusOptions: [{
          value: 0,
          label: "待解决"
        },
        {
          value: 1,
          label: "已解决"
        },
        {
          value: 2,
          label: "未解决"
        },
        {
          value: 3,
          label: "已挂起"
        }
      ],
      orderList: [],
      orderIdArr: [],
      states: "",
      rules: {
        orderNo: [
          { required: true, message: '请输入订单编号', trigger: 'change' }
        ],
        errorStatus: [
          { required: true, type: 'number', message: '请选择异常状态', trigger: 'change' }
        ],
        errorType: [
          { required: true, type: 'number', message: '请选择异常类型', trigger: 'change' }
        ],
        handerby: [
          { required: true, message: '请输入处理人', trigger: 'change' }
        ],
        errorMemo: [
          { required: true, message: '请输入异常描述', trigger: 'change' }
        ],
      }
    };
  },
  methods: {
    resetOrder() {},
    AddSubmit() {
      this.$refs['addExOrderForm'].validate((valid) => {
        if (valid) {
          reqGetOrderDetail({ orderId: this.exOrderInfo.orderNo }).then(res => {
            if (res.data.code != 29) {
              reqAddExOrder(this.exOrderInfo).then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  })
                  this.toOrderList()
                } else {
                  this.$message({
                    message: "服务器繁忙",
                    type: "info"
                  })
                }
              }).catch(err => {
                this.$message({
                  message: "服务器错误",
                  type: "error"
                })
              })
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    toOrderList() {
      this.$router.push("/orderException/list");
    },
    //搜索订单编号建议
    //远程拉取订单列表
    querySearchAsync(queryString, cb) {
      var that = this;
      var product = this.product;
      var results = queryString ? fetch(queryString) : product;

      function fetch(queryString) {
        let params = { orderNo: that.exOrderInfo.orderNo };
        reqNumToList(params).then(res => {
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
        newArray[n].value = Arr[n].orderNo;
        newArray[n].id = Arr[n].id;
      }
      return newArray;
    },
    handleSelect(item) {
      this.getOrderDetail(item.value);
    },
    getOrderDetail(orderId) {
      reqGetOrderDetail({ orderId }).then(res => {
        this.orderInfo = Object.assign({}, res.data.data,
          res.data.data.orderDetailList[0]
        )
      })
    },
    orderUnmatched() {
      this.$message.error("无匹配订单编号！");
    }
  },
  mounted() {}
};

</script>
