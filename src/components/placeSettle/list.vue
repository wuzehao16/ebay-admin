<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>分销结算</el-breadcrumb-item>
        <el-breadcrumb-item>结算列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

	  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
	    <el-form :inline="true" :model="filterOrders">
	      <el-form-item>
	        <el-input v-model="filterOrders.order_id" placeholder="订单编号"></el-input>
	      </el-form-item>	     
	      <el-form-item>
	        <el-input v-model="filterOrders.goods_name" placeholder="商品名称"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterOrders.user_name" placeholder="用户姓名"></el-input>
	      </el-form-item>
		  <el-form-item>
			  <el-select v-model="filterOrders.settle_status" placeholder="订单状态" clearable>
	    		<el-option key="0" label="待审核" value="0"></el-option>
	    		<el-option key="1" label="已通过" value="1"></el-option>
	    		<el-option key="2" label="未通过" value="2"></el-option>
	    		<el-option key="3" label="作废" value="3"></el-option>
			  </el-select>
		  </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="getPlaces">查询</el-button>
	      </el-form-item>
	  
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="places" v-loading='orderLoading' highlight-current-row @current-change="setHighlight" height='600' style="width: 100%">
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="order_id" label="订单编号" width='200'></el-table-column>
    	<el-table-column property="goods_name" label="商品名称" width='150'></el-table-column>
    	<el-table-column property="total_price" label="总价（元）" width='120'></el-table-column>
    	<el-table-column label="一级/提成（元）" width='160'>
    		<template scope="scope">
    			{{ scope.row.fir_level_name + "/" }}
    			{{ (scope.row.total_price * 10000 * scope.row.fir_level_per / 10000).toFixed(2) }}
    		</template>
    	</el-table-column>
    	<el-table-column label="二级/提成（元）" width='160'>
    		<template scope="scope">
    			{{ scope.row.sec_level_name + "/" }}
    			{{ (scope.row.total_price * 10000 * scope.row.sec_level_per / 10000).toFixed(2) }}
    		</template>
    	</el-table-column>
    	<el-table-column label="总提成（元）" width='120'>
    		<template scope="scope">
    			{{ (scope.row.total_price * 10000 * (scope.row.fir_level_per + scope.row.sec_level_per) / 10000).toFixed(2) }}
    		</template>
    	</el-table-column>
  
    	<el-table-column prop="settle_status" label="审核结算" width="120" :filters="[{ text: '待审核', value: 0 }, { text: '已通过', value: 1 }, { text: '未通过', value: 2 }, { text: '作废', value: 3 }]" :filter-method="filterSettleStatusTag" filter-placement="bottom-end">
        	<template scope="scope">
            	<el-tag :type="scope.row.settle_status == 0 ? 'primary' : 'success'" close-transition>
            		<template v-if='scope.row.settle_status == 0'>
            			待审核
            		</template>
            		<template v-else-if='scope.row.settle_status == 1'>
            			已通过
            		</template>
            		<template v-else-if='scope.row.settle_status == 2'>
            			未通过
            		</template>
            		<template v-else>
            			作废
            		</template>
            	</el-tag>
        	</template>
    	</el-table-column>  	
    	<el-table-column property="settle_time" label="结算时间" width='150'></el-table-column>
    	<el-table-column property="create_time" label="付款时间" width='150'></el-table-column>


	    <el-table-column fixed="right" label="操作" width='160'>
        	<template scope="scope">
            	<!-- <el-button size="small" type="primary" @click='showDetail(scope.row)'>详情</el-button> -->
            	<el-button size="small" type="primary" @click="showEdit(scope.row)">编辑</el-button>
            	<el-button size="small" @click="showSettle(scope.row)">审核</el-button>
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
  import { reqGetPlaceList } from '../../api/api';

  export default{
    data(){
      return {
        filterOrders: {
        	goods_name: '',
        	user_name: '',
        	order_id: '',
        	settle_status: ''
        },
        page_size: 20,
        orderLoading: false,
        orderPage: 1,
        total: 0,
        places: []
      }
    },
    methods: {
      setHighlight(val) {
      	this.currentRow = val
      },
      filterSettleStatusTag(value, row) {
      	return row.settle_status === value
      },
      setPageChange(val) {
      	this.orderPage = val
      	this.getPlaces()
      },
      //获取分销结算列表
      getPlaces() {

      	let pa = {
      		page: this.orderPage,
      		page_size: this.page_size
      	}
      	Object.assign(pa, this.filterOrders)
  	    this.orderLoading = true
		reqGetPlaceList(pa).then((res) => {
			this.total = res.data.total
			this.places = res.data.places
      		this.orderLoading = false
		})      	
      },
      showEdit(row) {
      	this.$router.push({
      		name:'结算编辑',
      		params:{
      			place: row
      		}
      	})
      },
      showSettle(row) {
      	this.$router.push({
      		name:'结算审核',
      		params:{
      			place: row
      		}
      	})      	
      }
    },
    mounted() {
      this.getPlaces();

    }
  }
</script>

