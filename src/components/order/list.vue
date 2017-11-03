<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

	  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
	    <el-form :inline="true" :model="filterOrders">
		  <!-- <el-form-item>
			  <el-select v-model="filterOrders.order_source" placeholder="订单来源" clearable>
	    		<el-option key="0" label="PC端" value="0"></el-option>
	    		<el-option key="1" label="移动端" value="1"></el-option>
			  </el-select>
		  </el-form-item> -->
		  <!-- <el-form-item>
			  <el-select v-model="filterOrders.user_type" placeholder="用户类型" clearable>
	    		<el-option key="0" label="分销商" value="0"></el-option>
	    		<el-option key="1" label="普通用户" value="1"></el-option>
			  </el-select>
		  </el-form-item> -->
		  <el-form-item>
			  <el-select v-model="filterOrders.orderStatus" placeholder="订单状态" clearable>
	    		<el-option key="0" label="待付款" value="0"></el-option>
	    		<el-option key="1" label="待发货" value="1"></el-option>
	    		<el-option key="2" label="已签收" value="2"></el-option>
	    		<el-option key="3" label="已拒签" value="3"></el-option>
			  </el-select>
		  </el-form-item>
		  <el-form-item>
			  <el-select v-model="filterOrders.payStatus" placeholder="Ebay状态" clearable>
	    		<el-option key="0" label="已下单" value="0"></el-option>
	    		<el-option key="1" label="已付款" value="1"></el-option>
	    		<el-option key="2" label="已发货" value="2"></el-option>
	    		<el-option key="3" label="已取消" value="3"></el-option>
			  </el-select>
		  </el-form-item><br/>		  
	      <el-form-item>
	        <el-input v-model="filterOrders.goods_name" placeholder="商品名称"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterOrders.buyerPhone" placeholder="手机号码"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterOrders.buyerName" placeholder="用户姓名"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterOrders.orderNo" placeholder="订单编号"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="getOrders">查询</el-button>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="showAdd">新增</el-button>
	      </el-form-item>
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="orders" v-loading='orderLoading' highlight-current-row @current-change="setHighlight" height='600' style="width: 100%">
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="orderNo" label="订单编号" width='200'></el-table-column>
    	<el-table-column property="goods_name" label="商品名称" width='150'></el-table-column>
    	<el-table-column property="goods_price" label="单价（元）" width='120'></el-table-column>
    	<el-table-column property="goods_amount" label="数量"></el-table-column>
    	<el-table-column property="orderAmount" label="总价（元）" width='120'>
    		<!-- <template scope="scope">
    			{{ (scope.row.goods_price * 10000 * scope.row.goods_amount / 10000).toFixed(2) }}
    		</template> -->
    	</el-table-column>
  
    	<el-table-column prop="orderStatus" label="订单状态" width="120" :filters="[{ text: '待付款', value: 0 }, { text: '待发货', value: 1 }, { text: '已签收', value: 2 }, { text: '已拒签', value: 3 }]" :filter-method="filterOrderStatusTag" filter-placement="bottom-end">
        	<template scope="scope">
            	<el-tag :type="scope.row.orderStatus == 0 ? 'primary' : 'success'" close-transition>
            		<template v-if='scope.row.orderStatus == 0'>
            			待付款
            		</template>
            		<template v-else-if='scope.row.orderStatus == 1'>
            			待发货
            		</template>
            		<template v-else-if='scope.row.orderStatus == 2'>
            			已签收
            		</template>
            		<template v-else>
            			已拒签
            		</template>
            	</el-tag>
        	</template>
    	</el-table-column> 
    	<el-table-column property="ebay_order_no" label="Ebay订单号" width='200'></el-table-column>
    	<el-table-column prop="payStatus" label="Ebay状态" width="120" :filters="[{ text: '已下单', value: 0 }, { text: '已付款', value: 1 }, { text: '已发货', value: 2 }, { text: '已取消', value: 3 }]" :filter-method="filterEbayStatusTag" filter-placement="bottom-end">
        	<template scope="scope">
            	<el-tag :type="scope.row.payStatus == 0 ? 'primary' : 'success'" close-transition>
            		<template v-if='scope.row.payStatus == 0'>
            			已下单
            		</template>
            		<template v-else-if='scope.row.payStatus == 1'>
            			已付款
            		</template>
            		<template v-else-if='scope.row.payStatus == 2'>
            			已发货
            		</template>
            		<template v-else>
            			已取消
            		</template>
            	</el-tag>
        	</template>
    	</el-table-column> 
    	
    	<el-table-column property="buyerName" label="用户姓名" width='100'></el-table-column>
    	<el-table-column prop="user_type" label="会员类型" width="120" :filters="[{ text: '分销商', value: 0 }, { text: '普通用户', value: 1 }]" :filter-method="filterTag" filter-placement="bottom-end">
        	<template scope="scope">
            	<el-tag :type="scope.row.user_type == 0 ? 'primary' : 'success'" close-transition>{{scope.row.user_type == 0 ? '分销商':'普通用户'}}</el-tag>
        	</template>
    	</el-table-column>    	
    	<el-table-column property="buyerPhone" label="手机号码" width='150'></el-table-column>
    	<el-table-column  label="订单来源" width='100'>
    		<template scope="scope">
    			{{ scope.row.order_source == "0" ? 'PC端':'移动端' }}
    		</template>
    	</el-table-column>    	
    	<el-table-column property="create_time" label="创建时间" width='150'></el-table-column>


	    <el-table-column fixed="right" label="操作" width='160'>
        	<template scope="scope">
            	<el-button size="small" type="primary" @click='showDetail(scope.row)'>详情</el-button>
            	<el-button size="small" @click="showEdit(scope.row)">编辑</el-button>
        	</template>
    	</el-table-column>
  	</el-table>
  	<!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="setPageChange" :page-size="page_size" :total="total" style="float:right;">
        </el-pagination>
    </el-col>



    </el-col>
  </el-row>
</template>
<script>
  import util from '../../common/util'
  import { reqGetOrderList } from '../../api/index';

  export default{
    data(){
      return {
        filterOrders: {
        	order_source: '',
        	user_type: '',
        	orderStatus: '',
        	payStatus: '',
        	goods_name: '',
        	buyerPhone: '',
        	buyerName: '',
        	orderNo: ''
        },
        page_size: 20,
        orderLoading: false,
        orderPage: 1,
        total: 0,
        orders: [],
      }
    },
    methods: {
      setHighlight(val) {
      	this.currentRow = val
      },
      filterTag(value, row) {
        return row.user_type === value;
      },
      filterOrderStatusTag(value, row) {
      	return row.orderStatus === value
      },
      filterEbayStatusTag(value, row) {
      	return row.payStatus === value
      },
      setPageChange(val) {
      	this.orderPage = val
      	this.getOrders()
      },
      //获取用户列表
      getOrders() {

      	let pa = {
      		page: this.orderPage,
      		page_size: this.page_size
      	}
      	Object.assign(pa, this.filterOrders)
  	    this.orderLoading = true
      	reqGetOrderList(pa).then((res) => {
      		this.total = res.data.total
      		this.orders = res.data.data
      		this.orderLoading = false
      	})
      },
      showEdit(row) {
      	this.$router.push({
      		name:'订单编辑',
      		params:{
      			order: row
      		}
      	})
      },
      showDetail(row) {
      	this.$router.push({
      		name:'订单详情',
      		params:{
      			order: row
      		}
      	})      	
      },
      showAdd() {
      	this.$router.push('/order/add')
      }
    },
    mounted() {
      this.getOrders();
    }
  }
</script>

