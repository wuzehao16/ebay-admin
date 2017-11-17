<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/orderException/list' }">订单异常</el-breadcrumb-item>
        <el-breadcrumb-item>异常订单处理</el-breadcrumb-item>
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
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
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
          </el-row>
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
              <el-form-item label='异常类型'>
      				  <el-select v-model.number="orderInfo.errorType" placeholder="异常类型" disabled>
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
            <el-col :span='16'>
              <el-form-item label='异常描述'>
				<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容"
				  v-model="orderInfo.errorMemo" disabled>
				</el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='异常状态'>
				  <!-- <el-select v-model="orderInfo.errorStatus" placeholder="异常状态" :disabled="handle.handerType==0"> -->
          <el-select v-model="orderInfo.errorStatus" placeholder="异常状态" >
		    		<el-option v-for="item in exStatusOptions" :key="item.value" :label="item.label" :value="item.value" >
		    		</el-option>
				  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='处理方式'>
                <el-radio-group v-model='handle.handerType' :change="changeErrorStatus">
                  <el-radio :label="'0'">退款</el-radio>
                  <el-radio :label="'1'">协商</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='处理人'>
                <el-input  placeholder="处理人"
                  v-model="handle.handerby">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='解决说明'>
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容"
                  v-model="handle.sloveMemo">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16' :offset='10'>
			 	<el-button type="success" @click='editSubmit'>更新</el-button>
			    <el-button type="info" @click='toOrderList'>返回列表</el-button>
		    </el-col>
          </el-row>
        </el-form>

        <el-col :span='16' :offset='4'>
          <label style="font-weight:bold;margin: 20px 0;">异常订单处理跟踪记录：</label>
          <!-- <el-button type="text" @click="addFormVisible = true">新增</el-button> -->
          <br/><br/>
          <el-table :data="rcList" border style="width: 100%;margin-bottom:40px;">
            <el-table-column prop="sloveMemo" label="解决说明" min-width="160"></el-table-column>
            <el-table-column  label="跟进时间" width="160">
              <template scope="scope">
                {{ fTimestamp(scope.row.updated) }}
              </template>
            </el-table-column>
            <el-table-column label="处理方式" width="100">
              <template scope="scope">
                {{ scope.row.handerType == 0 ? "退款" : "协商" }}
              </template>
            </el-table-column>
            <el-table-column prop="createdby" label="处理人" width="110"></el-table-column>
            <el-table-column width="120" label="操作">
              <template slot-scope="scope">
                <el-button @click="editOrderRc(scope)" type="text" size="small">编辑</el-button>
                <el-button type="text" size="small" @click="deleteOrderRc(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-col>
    </el-col>

    <!-- 编辑 -->
      <el-dialog title="收货地址" :visible.sync="editFormVisible">
        <el-form :model="editForm">
          <el-form-item label="处理人" :label-width="formLabelWidth">
            <el-input v-model="editForm.createdby" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="处理方式" :label-width="formLabelWidth">
            <el-select v-model="editForm.handerType" placeholder="请选择活动区域">
              <el-option label="退款" value="0"></el-option>
              <el-option label="协商" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='解决说明' :label-width="formLabelWidth">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容"
              v-model="editForm.sloveMemo" >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="edit-footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editOrderRcSubmit()">确 定</el-button>
        </div>
      </el-dialog>
  </el-row>

</template>
<script>
import util from "../../common/util";
import {
  reqaddExOrderRcList,
  reqGetExOrderRcList,
  reqEditExOrder,
  reqDeleteExOrderRcList,
  reqGetOrderList,
  reqGetOrderDetail
} from "../../api/index";

export default {
  data() {
    return {
      orderInfo: {},
      rcList: [],
      addFormVisible: false,
      editFormVisible: false,
      formLabelWidth: "120px",
      handleStatus: "",
      editForm: {
        createdby: "",
        handerType: "",
        sloveMemo: "",
        updated: ""
      },
      handle: {
        sloveMemo: "",
        handerby: "",
        handerType: "",
        updated: ""
      },
      handle_bak: {},
      orderInfo_bak: {},
      exTypeOptions: [
        {
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
      exStatusOptions: [
        {
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
    validation(){
       if (this.orderInfo.handerby == "") {
        this.$message.error("请输入处理人");
        return false;
      }
      if (this.orderInfo.sloveMemo == "") {
        this.$message.error("请输入解决说明");
        return false;
      }
      return true
    },
    editSubmit() {
      Object.assign(this.orderInfo, this.handle);
      if (!this.validation()) return
      reqEditExOrder(this.orderInfo).then(res => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.orderInfo.updated = this.fTimestamp(new Date());
        this.rcList.push(this.orderInfo);
      });
    },
    changeErrorStatus(val) {
      this.orderInfo.errorStatus = "1";
    },
    resetOrder() {
      this.orderInfo = Object.assign({}, this.orderInfo_bak);
      this.handle = Object.assign({}, this.handle_bak);
    },
    toOrderList() {
      this.$router.push("/orderException/list");
    },
    getRcList() {
      //获取订单轨迹
      let params = { errorNo: this.orderInfo.errorNo };
      reqGetExOrderRcList(params).then(res => {
        this.rcList = res.data.data.content;
      });
    },
    validationrc(){
       if (this.editForm.createdby == "") {
        this.$message.error("请输入处理人");
        return false;
      }
      if (this.editForm.sloveMemo == "") {
        this.$message.error("请输入解决说明");
        return false;
      }
      return true
    },
    editOrderRcSubmit(scope) {
      //编辑提交订单轨迹
      let params = Object.assign(this.orderInfo, this.editForm);
      if (!this.validationrc()) return      
      reqaddExOrderRcList(params).then(res => {
        this.editFormVisible = false;
        this.getRcList();
      });
    },
    editOrderRc(scope) {
      //编辑订单轨迹
      this.editFormVisible = true;
      this.editForm = scope.row;
      console.log(scope.row)
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
    getOrderDetail() {
      let params = { orderNo: this.orderInfo.orderNo };
      reqGetOrderDetail(params).then(res => {
        if (res.data.data.length < 1) {
          return;
        }
        this.orderInfo = Object.assign(
          {},
          this.orderInfo,
          res.data.data.content[0]
        );
      });
    }
  },
  mounted() {
    this.orderInfo = this.$route.params.ex_order;
    // this.handle = Object.assign({},this.orderInfo)
    this.getOrderDetail();
    Object.assign(this.orderInfo_bak, this.$route.params.ex_order);
    Object.assign(this.handle_bak, this.handle);
    this.getRcList();
  }
};
</script>
