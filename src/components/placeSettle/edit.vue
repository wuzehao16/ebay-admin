<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/placeSettle/list' }">分销结算</el-breadcrumb-item>
        <el-breadcrumb-item>结算编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
      <el-col :span="24" class="toolbarff">
        <el-form :model="orderInfo" ref='editForm' label-width='100px'>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='订单编号'>
                <el-input v-model="orderInfo.order_id" placeholder="订单编号" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品名称'>
                <el-input v-model="orderInfo.goods_name" placeholder="商品名称" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='商品单价（元）'>
                <el-input v-model="orderInfo.goods_price" placeholder="商品单价" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='数量'>
                <el-input v-model="orderInfo.goods_amount" placeholder="数量" disabled></el-input>
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
                <el-input v-model="orderInfo.goods_tax" placeholder="商品税费" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='物流费用（元）'>
                <el-input v-model="orderInfo.logistics_fees" placeholder="物流费用" disabled></el-input>
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
                <el-input v-model="orderInfo.user_name" placeholder="购买用户" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='订单状态' disabled>
				<el-select v-model.number="orderInfo.order_status" placeholder="订单状态" disabled>
	    		<el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.label" :value="item.value">
	    		</el-option>
	    		</el-select>            
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='一级客户'>
                <el-input v-model="orderInfo.fir_level_name" placeholder="一级客户"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='一级提成比例'>
                <el-input v-model="orderInfo.fir_level_per" placeholder="一级提成比例"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='二级客户'>
                <el-input v-model="orderInfo.sec_level_name" placeholder="二级客户"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='二级比例提成'>
                <el-input v-model="orderInfo.sec_level_per" placeholder="二级比例提成"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='一级提成'>
                <el-input v-model="firDrawPer" placeholder="一级提成" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='二级提成'>
                <el-input v-model="secDrawPer" placeholder="二级提成" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>    
          
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
import { reqGetPlaceEdit } from '../../api/api';

export default {
  data() {
    return {
      orderInfo: {},
      orderInfo_bak: {},
      orderStatusOptions: [{
      		value: 0,
      		label: "待付款"
      	},{
      		value: 1,
      		label: "待发货"
      	},{
      		value: 2,
      		label: "待签收"
      	},{
      		value: 3,
      		label: "已签收"
      	}
      ]
    }
  },
  methods: {
    handleAddressChange(val) {
      console.log(val)
    },
    editSubmit() {
    	reqGetPlaceEdit(this.orderInfo).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
    	})
    },
    resetOrder() {
    	this.orderInfo = Object.assign( {}, this.orderInfo_bak)    	
    },
    toOrderList() {
    	this.$router.push('/placeSettle/list')
    }

  },
  computed: {
  	calGoodsTotalPrice() {
  		return (this.orderInfo.goods_amount * this.orderInfo.goods_price).toFixed(2)
  	},
  	calOrderTotalPrice() {
  		return (parseFloat(this.calGoodsTotalPrice) + this.orderInfo.goods_tax + this.orderInfo.logistics_fees).toFixed(2)
  	},
  	firDrawPer() {
  		return (parseFloat(this.calOrderTotalPrice) * this.orderInfo.fir_level_per).toFixed(2)
  	},
  	secDrawPer() {
  		return (parseFloat(this.calOrderTotalPrice) * this.orderInfo.sec_level_per).toFixed(2)
  	}

  },
  mounted() {
  	this.orderInfo = this.$route.params.place
	Object.assign( this.orderInfo_bak, this.$route.params.place )
  }
}

</script>
