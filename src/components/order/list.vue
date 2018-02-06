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
	      <el-form-item>
	        <el-input v-model="filterOrders.orderNo" placeholder="订单编号"></el-input>
	      </el-form-item>
	  
	      <el-form-item>
	        <el-input v-model="filterOrders.productName" placeholder="商品名称"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterOrders.buyerName" placeholder="用户姓名"></el-input>
	      </el-form-item>
				<el-form-item>
	        <el-input v-model="filterOrders.buyerPhone" placeholder="手机号码"></el-input>
	      </el-form-item>
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
				</el-form-item>	
	      <el-form-item>
	        <el-button type="primary" @click="getOrders">查询</el-button>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="success" @click="showAdd">新增</el-button>
	      </el-form-item>
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="orders" v-loading='orderLoading'  @current-change="setHighlight"  style="width: 100%">
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
  
    	<el-table-column prop="orderStatus" label="订单状态" width="120">
        	<template scope="scope">
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
        	</template>
    	</el-table-column> 
    	<el-table-column property="ebayNo" label="Ebay订单号" width='200'></el-table-column>
    	<el-table-column property="ebayStatus" label="Ebay状态" width="120" >
        	<template scope="scope">
            		<template v-if='scope.row.ebayStatus == "1"'>
            			待支付
            		</template>
            		<template v-else-if='scope.row.ebayStatus == "2"'>
            			已取消
            		</template>
            		<template v-else-if='scope.row.ebayStatus == "3"'>
            			已支付
            		</template>
								<template v-else-if='scope.row.ebayStatus == "4"'>
            			已发货
            		</template>
            		<template v-else-if='scope.row.ebayStatus == "5"'>
            			已完成-海外仓已签收
            		</template>
                <template v-else>
                  未下单
                </template>
        	</template>
    	</el-table-column>
    	<el-table-column property="buyerName" label="买家姓名" width='160'></el-table-column>	
    	<el-table-column property="buyerPhone" label="手机号码" width='150'></el-table-column>
    	<el-table-column  label="创建时间" width='150' >
				<template scope="scope">
					{{fTimestamp(scope.row.created)}}
				</template>
			</el-table-column>
	    <el-table-column fixed="right" label="操作" width='200'>
        	<template scope="scope">
            	<el-button size="small" type="primary" @click='showDetail(scope)'>详情</el-button>
            	<el-button size="small" @click="showEdit(scope)">编辑</el-button>
							<el-button size="small" type="danger" @click="cancelOrder(scope.row)" :disabled="scope.row.orderStatus != '1'">取消</el-button>
        	</template>
    	</el-table-column>
  	</el-table>
  	<!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-pagination layout="total, sizes, prev, pager, next" @current-change="setPageChange" @size-change="setSizeChange" :page-size="size" :total="total" style="float:right;">
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
        size: 20,
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
			setSizeChange(val) {
				this.size = val;
				this.getOrders()
			},
      //获取用户列表
      getOrders() {

      	let pa = {
      		page: this.orderPage - 1,
      		size: this.size
      	}
      	Object.assign(pa, this.filterOrders)
  	    this.orderLoading = true
      	reqGetOrderList(pa).then((res) => {
      		this.total = res.data.data.totalElements
      		this.orders = res.data.data.content
      		this.orderLoading = false
      	})
      },
      showEdit(scope) {
      	this.$router.push({
      		name:'订单编辑', 
      		params:{
      			order: this.orders[scope.$index]
      		}
      	})
      },
      showDetail(scope) {
				
      	this.$router.push({
      		// name:'订单详情',
          name:'订单编辑', 
      		params:{
      			order: this.orders[scope.$index],
            isDetail: true
      		}
      	})      	
      },
      showAdd() {
      	this.$router.push('/order/add')
			},
			cancelOrder(p) {
				//取消订单
				let orderId = p.orderNo;
				let params = {
					orderId:orderId,
					openid:"1"
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
							p.orderStatus = "2";
							
						}else{
							
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

