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
	    		<el-option key="1" label="待支付" value="1"></el-option>
	    		<el-option key="2" label="已取消" value="2"></el-option>
	    		<el-option key="3" label="已支付" value="3"></el-option>
	    		<el-option key="4" label="已发货" value="4"></el-option>
	    		<el-option key="5" label="已完成" value="5"></el-option>
	    		<el-option key="6" label="已评价" value="6"></el-option>
	    		<el-option key="7" label="退款中" value="7"></el-option>
	    		<el-option key="8" label="已退款" value="8"></el-option>
	    		<el-option key="9" label="已删除" value="9"></el-option>
			  </el-select>
		  </el-form-item>
		  <el-form-item>
			  <el-select v-model="filterOrders.ebayStatus" placeholder="Ebay状态" clearable>
	    		<el-option key="1" label="待支付" value="1"></el-option>
	    		<el-option key="2" label="已取消" value="2"></el-option>
	    		<el-option key="3" label="已支付" value="3"></el-option>
	    		<el-option key="4" label="已发货" value="4"></el-option>
	    		<el-option key="5" label="已完成-海外仓已签收" value="5"></el-option>
			  </el-select>
		  </el-form-item><br/>		  
	      <el-form-item>
	        <el-input v-model="filterOrders.productName" placeholder="商品名称"></el-input>
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


    <el-table ref="singleTable" :data="orders" v-loading='orderLoading'  @current-change="setHighlight" height='600' style="width: 100%">
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="orderNo" label="订单编号" width='200'></el-table-column>
    	<el-table-column property="productName" label="商品名称" width='250'></el-table-column>
    	<el-table-column property="productPrice" label="单价（元）" width='120'></el-table-column>
    	<el-table-column property="productQuantity" label="数量"></el-table-column>
    	<el-table-column property="orderAmount" label="总价（元）" width='120'>
    		<!-- <template scope="scope">
    			{{ (scope.row.productPrice * 10000 * scope.row.productQuantity / 10000).toFixed(2) }}
    		</template> -->
    	</el-table-column>
  
    	<el-table-column prop="orderStatus" label="订单状态" width="120" :filters="[{ text: '待支付', value: 1 }, { text: '已取消', value: 2 }, { text: '已支付', value: 3 }, { text: '已发货', value: 4 },
			{ text: '已完成', value: 5 }, { text: '已评价', value: 6 }, { text: '退款中', value: 7 }, { text: '已退款', value: 8 },{text:'已删除',value:9}]" :filter-method="filterOrderStatusTag" filter-placement="bottom-end">
        	<template scope="scope">
            	<el-tag :type="scope.row.orderStatus == 1 ? 'primary' : 'success'" close-transition>
            		<template v-if='scope.row.orderStatus == 1'>
            			待支付
            		</template>
            		<template v-else-if='scope.row.orderStatus == 2'>
            			已取消
            		</template>
            		<template v-else-if='scope.row.orderStatus == 3'>
            			已支付
            		</template>
            		<template v-else-if='scope.row.orderStatus == 4'>
            			已发货
            		</template>
            		<template v-else-if='scope.row.orderStatus == 5'>
            			已完成
            		</template>
            		<template v-else-if='scope.row.orderStatus == 6'>
            			已评价
            		</template>
            		<template v-else-if='scope.row.orderStatus == 7'>
            			退款中
            		</template>
            		<template v-else-if='scope.row.orderStatus == 8'>
            			已退款
            		</template>
            		<template v-else>
            			已删除
            		</template>
            	</el-tag>
        	</template>
    	</el-table-column> 
    	<el-table-column property="ebayNo" label="Ebay订单号" width='200'></el-table-column>
    	<el-table-column property="ebayStatus" label="Ebay状态" width="180" :filters="[{ text: '待支付', value: 1 }, { text: '已取消', value: 2 }, { text: '已支付', value: 3 }, { text: '已发货', value: 4 },{ text: '已完成-海外仓已签收', value: 5 }]" :filter-method="filterEbayStatusTag" filter-placement="bottom-end">
        	<template scope="scope">
            	<el-tag :type="scope.row.ebayStatus == 1 ? 'primary' : 'success'" close-transition>
            		<template v-if='scope.row.ebayStatus == 1'>
            			待支付
            		</template>
            		<template v-else-if='scope.row.ebayStatus == 2'>
            			已取消
            		</template>
            		<template v-else-if='scope.row.ebayStatus == 3'>
            			已支付
            		</template>
								<template v-else-if='scope.row.ebayStatus == 4'>
            			已发货
            		</template>
            		<template v-else>
            			已完成-海外仓已签收
            		</template>
            	</el-tag>
        	</template>
    	</el-table-column> 
    	
    	<el-table-column property="buyerName" label="买家姓名" width='100'></el-table-column>
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
    	<el-table-column property="created" label="创建时间" width='150' :formatter="dateFormat"></el-table-column>


	    <el-table-column fixed="right" label="操作" width='200'>
        	<template scope="scope">
            	<el-button size="small" type="primary" @click='showDetail(scope.row)'>详情</el-button>
            	<el-button size="small" @click="showEdit(scope.row)">编辑</el-button>
							<el-button size="small" type="danger" @click="cancelOrder(scope.row)">取消</el-button>
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
  import { reqGetOrderList , reqCancelOrder} from '../../api/index';

  export default{
    data(){
      return {
        filterOrders: {
        	order_source: '',
        	user_type: '',
        	orderStatus: '',
        	ebayStatus: '',
        	productName: '',
        	buyerPhone: '',
        	buyerName: '',
					orderNo: '',
					ebayNo:""
        },
        page_size: 20,
        orderLoading: false,
        orderPage: 1,
        total: 0,
        orders: [],
      }
    },
    methods: {
			dateFormat:function(row, column) {  
					let date = row[column.property];  
					if (date == undefined) {  
							return "";  
					}
					let t = new Date(date)
					return t.toLocaleDateString();  
      }, 
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
			},
			//取消订单
			cancelOrder(p) {
				let orderId = p.orderNo;
				let params = {
					orderId:orderId
				}
				this.$confirm('是否取消订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
					type: 'warning'
				
        }).then( ()=>{
					
					reqCancelOrder(params).then(res => {
						if(res.data.code == 0) {
							 this.$message({
								type: 'success',
								message: '取消订单成功!'
							});
						}else{
							console.log(1)
							let action = res.data.msg
							this.$alert(`${ action }`, '提示', {
								confirmButtonText: '确定',
							});
						}
					})
					}
        )
			}
    },
    mounted() {
      this.getOrders();
    }
  }
</script>

