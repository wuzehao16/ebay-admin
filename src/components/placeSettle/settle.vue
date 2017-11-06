<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/placeSettle/list' }">分销结算</el-breadcrumb-item>
        <el-breadcrumb-item>{{ crumbName }}</el-breadcrumb-item>
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
                <el-input v-model="distrInfo.productName" placeholder="商品名称" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='商品单价（元）'>
                <el-input :value="(orderInfo.orderDetailList ? orderInfo.orderDetailList[0].productPrice : '')" placeholder="商品单价" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='数量'>
                <el-input :value="(orderInfo.orderDetailList ? orderInfo.orderDetailList[0].productQuantity : '')" placeholder="数量" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='商品总价（元）'>
                <el-input v-bind:value="orderInfo.orderAmount" placeholder="商品总价" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
         <!--      <el-form-item label='商品税费（元）'>
                <el-input v-model="orderInfo.goods_tax" placeholder="商品税费" disabled></el-input>
              </el-form-item> -->
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='物流费用（元）'>
                <el-input v-model="orderInfo.carriageFee" placeholder="物流费用" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='订单总价（元）'>
                <el-input :value="orderInfo.orderAmount + orderInfo.carriageFee" placeholder="订单总价" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='购买用户'>
                <el-input v-model="orderInfo.buyerName" placeholder="购买用户" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='订单状态' disabled>
        				  <el-select v-model.number="orderInfo.orderStatus" placeholder="订单状态" disabled>
          	    		<el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.label" :value="item.value">
          	    		</el-option>
        	    		</el-select>            
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='一级客户'>
                <el-input v-model="distrInfo.firstDistName" placeholder="一级客户" :disabled="isSettle"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='一级提成比例'>
                <el-input v-model="distrInfo.firstDistRatio" placeholder="一级提成比例" :disabled="isSettle"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='二级客户'>
                <el-input v-model="distrInfo.secondDistName" placeholder="二级客户" :disabled="isSettle"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='二级提成比例'>
                <el-input v-model="distrInfo.secondDistRatio" placeholder="二级比例提成" :disabled="isSettle"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='一级提成'>
                <el-input v-model="distrInfo.firstCommission" placeholder="一级提成" :disabled="isSettle"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='二级提成'>
                <el-input v-model="distrInfo.secondCommission" placeholder="二级提成" :disabled="isSettle"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="isSettle">
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='审核结论'>
                <el-radio-group v-model='distrInfo.auditStatus'>
                    <el-radio v-for="i in auditStatusOptions"  :key="i.value"
                    :label="i.value">{{ i.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='审核意见'>
        				<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容"
        				  v-model="distrInfo.auditOpinion">
        				</el-input>
              </el-form-item>
            </el-col>
          </el-row>    
          </template>              
          
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
import { reqDistrEdit, reqDistrDetail } from '../../api';

export default {
  data() {
    return {
      orderInfo: {},
      orderInfo_bak: {},
      auditStatusOptions: [{
          value: '0',
          label: '待审核'
        },{
          value: '1',
          label: '未通过'
        },{
          value: '2',
          label: '已通过'
        },{
          value: '3',
          label: '作废'
        }
      ],
      orderStatusOptions: [{
      		value: '1',
      		label: "待付款"
      	},{
      		value: '2',
      		label: "已取消"
      	},{
      		value: '3',
      		label: "已支付"
      	},{
          value: '4',
          label: "已发货"
        },{
          value: '5',
          label: "已完成"
        },{
          value: '6',
          label: "已评价"
        },{
          value: '7',
          label: "退款中"
        },{
          value: '8',
          label: "已退款"
        },{
          value: '9',
          label: "已删除"
        }
      ],


      distrInfo: {},
      isSettle: true,
      crumbName: '结算审核'
    }
  },
  methods: {
    editSubmit() {
    	reqDistrEdit({distribution: this.distrInfo}).then((res) => {
        console.log(res)
        if (res.data.code == 0) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.data.msg)
        }

    	})
    },
    resetOrder() {
    	this.orderInfo = Object.assign( {}, this.orderInfo_bak)    	
    },
    toOrderList() {
    	this.$router.push('/placeSettle/list')
    }

  },
  mounted() {
     let s = this.$route.params.isEdit

     console.log("s", s)
     if (s) {
        this.isSettle = false
        this.crumbName = '结算编辑'
     }
     let id = this.$route.params.id
     if (id) {
        reqDistrDetail({id}).then((res) => {
          console.log(res)
          let d = res.data.data
          if (d) {
            this.distrInfo = d.distribution
            this.orderInfo = d.order
          }
        }).catch((err) => {
          console.log(err)
        })
     } else {
        this.$router.push('/placeSettle/list')
     }
  }
}

</script>
