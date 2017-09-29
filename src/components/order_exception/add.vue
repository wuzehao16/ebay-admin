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
        <el-form :model="exOrderInfo" ref='editForm' label-width='100px'>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='订单编号'>
			    <el-autocomplete class="inline-input" v-model="exOrderInfo.order_id" 
			    :fetch-suggestions="querySearch" placeholder="订单编号" 
			    @select="handleSelect"></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='商品名称'>
                <el-input v-model="exOrderInfo.goods_name" placeholder="商品名称" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='卖家邮箱'>
                <el-input v-model="exOrderInfo.seller_email" placeholder="卖家邮箱" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='卖家电话'>
                <el-input v-model="exOrderInfo.seller_tel" placeholder="卖家电话" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='买家姓名'>
                <el-input v-model="exOrderInfo.user_name" placeholder="买家姓名" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='买家电话'>
                <el-input v-model="exOrderInfo.tel" placeholder="买家电话" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='异常类型'>
				  <el-select v-model.number="exOrderInfo.ex_type" placeholder="异常类型">
		    		<el-option v-for="item in exTypeOptions" :key="item.value" :label="item.label" :value="item.value">
		    		</el-option>
				  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='订单总价（元）'>
                <el-input v-model="exOrderInfo.order_total" placeholder="订单总价" disabled></el-input>
              </el-form-item>              
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='异常描述'>
				<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容"
				  v-model="exOrderInfo.ex_description">
				</el-input>
              </el-form-item>
            </el-col>
          </el-row>          

          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='异常状态'>
				  <el-select v-model="exOrderInfo.ex_status" placeholder="异常状态">
		    		<el-option v-for="item in exStatusOptions" :key="item.value" :label="item.label" :value="item.value">
		    		</el-option>
				  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
        
            </el-col>            
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16' :offset='10'>
			 	<el-button type="success" @click='AddSubmit'>提交</el-button>
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
import { reqGetOrderList, reqAddExOrder } from '../../api/api';

export default {
  data() {
    return {
      exOrderInfo: {
      	order_id: '',
      	ex_status: '',
      	ex_type: ''
      },

      exTypeOptions: [{
      		value: 0,
      		label: "系统异常"
      	},{
      		value: 1,
      		label: "Ebay缺货"
      	},{
      		value: 2,
      		label: "卖家取消订单"
      	}
      ],
      exStatusOptions: [{
      		value: 0,
      		label: "待解决"
      	},{
      		value: 1,
      		label: "已解决"
      	},{
      		value: 2,
      		label: "已挂起"
      	}
      ],
      orderList: [],
      orderIdArr: [],
      states: ''
    }
  },
  methods: {
    resetOrder() {

    },
	getOrderList() {

		let pa = {
	  		// page: 0,
	  		// page_size: this.page_size
	  	}
	    /*	Object.assign(pa, this.filterOrders)*/
	    this.orderIdArr = []
	  	reqGetOrderList(pa).then((res) => {
	  		this.orderList = res.data.orders
			for (let o of this.orderList ) {
				Object.assign(o,{value:o.order_id})
				this.orderIdArr.push(o.order_id)
			}
	  	})
	},
	AddSubmit() {
		if ( !this.orderIdArr.includes(this.exOrderInfo.order_id) ) {
			this.orderUnmatched()
			return false
		}

		console.log(this.exOrderInfo)

    	reqAddExOrder(this.exOrderInfo).then((res) => {
        this.$message({
          message: '提交成功',
          type: 'success'
        });
    	})		
	},
    toOrderList() {
      this.$router.push('/orderException/list')
    },
    //搜索订单编号建议
	querySearch(queryString, cb) {
		console.log(queryString)
		var orders = this.orderList
		var results = queryString ? orders.filter(this.createFilter(queryString)) : orders;
		results.length === 0 ? this.orderUnmatched() : ''
		// 调用 callback 返回建议列表的数据
		cb(results);
	},
	createFilter(queryString) {
		return (order) => {
		  return (order.value.indexOf(queryString.toLowerCase()) === 0);
		};
	},    
	handleSelect(item) {
		console.log(item);
		this.exOrderInfo.goods_name = item.goods_name
		this.exOrderInfo.seller_email = item.seller_email
		this.exOrderInfo.seller_tel = item.seller_tel
		this.exOrderInfo.user_name = item.user_name
		this.exOrderInfo.tel = item.tel
		this.exOrderInfo.order_total = (item.goods_price * item.goods_amount + item.goods_tax + item.logistics_fees)

	},
	orderUnmatched() {
		this.$message.error('无匹配订单编号！');
	}	
  },
  mounted() {
  	this.getOrderList()
  }
}

</script>
