<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/orderException/list' }">订单异常</el-breadcrumb-item>
        <el-breadcrumb-item>异常订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
      <el-col :span="24" class="toolbarff">
        <el-form :model="orderInfo" ref='editForm' label-width='100px'>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='订单编号'>
                <el-input v-model="orderInfo.orderNo" placeholder="订单编号" disabled></el-input>
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
                <el-input v-model="orderInfo.seller_email" placeholder="卖家邮箱" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='卖家电话'>
                <el-input v-model="orderInfo.seller_tel" placeholder="卖家电话" disabled></el-input>
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
              <el-form-item label='订单总价'>
                <el-input v-model="orderInfo.orderAmount" placeholder="订单总价" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='异常类型' v-if="rcList[0]">
                <el-select v-model.number="rcList[0].errorType" placeholder="异常类型" disabled>
                  <el-option v-for="item in exTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='异常状态' v-if="rcList[0]">
                <el-select v-model="rcList[0].errorStatus" placeholder="异常状态" disabled>
                  <el-option v-for="item in exStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='异常描述' v-if="rcList[0]">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" v-model="rcList[0].errorMemo" disabled>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-col :span='16' :offset='4'>
          <label style="font-weight:bold;margin: 20px 0;">异常订单处理跟踪记录：</label>
          <br/>
          <br/>
          <el-table :data="rcList" border style="width: 100%;margin-bottom:40px;">
            <el-table-column prop="sloveMemo" label="解决说明"></el-table-column>
            <el-table-column label="跟进时间" width="180">
              <template slot-scope="scope">
                {{ fTimestamp(scope.row.updated) }}
              </template>
            </el-table-column>
            <el-table-column label="处理方式" width="100">
              <template slot-scope="scope">
                <template v-if='scope.row.handerType == "0"'>退款</template>
                <template v-else-if='scope.row.handerType == "1"'>协商</template>
                <template v-else>创建异常</template>
              </template>
            </el-table-column>
            <el-table-column prop="createdby" label="处理人" width="120"></el-table-column>
            <!-- <el-table-column width="120" label="操作">
          <template slot-slot-scope="scope">
            <el-button @click="editOrderRc(scope)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="deleteOrderRc(scope)">删除</el-button>
          </template>        
        </el-table-column>         -->
          </el-table>
        </el-col>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
import util from "../../common/util";
import {
  reqEditExOrder,
  reqGetExOrderRcList,
  reqDeleteExOrderRcList,
  reqGetOrderList,
  reqGetOrderDetail
} from "../../api/index";

export default {
  data() {
    return {
      orderInfo: {},
      rcList: [],
      exTypeOptions: [{
          value: "0",
          label: "系统异常"
        },
        {
          value: "1",
          label: "Ebay缺货"
        },
        {
          value: "2",
          label: "卖家取消订单"
        }
      ],
      exStatusOptions: [{
          value: "0",
          label: "待解决"
        },
        {
          value: "1",
          label: "已解决"
        },
        {
          value: "2",
          label: "未解决"
        },
        {
          value: "3",
          label: "已挂起"
        }
      ]
    };
  },
  methods: {
    getRcList() {
      //获取订单轨迹
      let params = { errorNo: this.orderInfo.errorNo };
      reqGetExOrderRcList(params).then(res => {
        this.rcList = res.data.data.content;
        console.log(this.rcList)
      })
    },

    editOrderRc(scope) {
      //编辑订单轨迹

    },

    deleteOrderRc(scope) {
      //删除订单轨迹
      let params = {
        id: scope.row.id
      };
      this.$confirm("确认删除订单跟踪记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        reqDeleteExOrderRcList(params).then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.rcList.splice(scope.$index, 1);
          } else {
            let action = res.data.msg;
            this.$alert(`${action}`, "提示", {
              confirmButtonText: "确定"
            });
          }
        });
      });
    },
    getOrderDetail(orderId) {
      reqGetOrderDetail({ orderId }).then(res => {
        this.orderInfo = Object.assign({}, res.data.data, res.data.data.orderDetailList[0]);

      });
    }
  },
  mounted() {
    this.orderInfo = this.$route.params.ex_order
    if (!this.orderInfo) {
      this.$router.push('/orderException/list')
    } else {
      let orderNo = this.$route.params.ex_order.orderNo
      this.getOrderDetail(orderNo)
      this.getRcList()
    }
  }
};

</script>
<style>
.toolbarff .el-form-item__label {
  text-align: left;
}

</style>
