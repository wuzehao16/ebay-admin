<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>订单异常管理</el-breadcrumb-item>
        <el-breadcrumb-item>异常订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

	  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
	    <el-form :inline="true" :model="filterExOrders">
		  <el-form-item>
			  <el-select v-model="filterExOrders.ex_status" placeholder="异常状态" clearable>
	    		<el-option key="0" label="待解决" value="0"></el-option>
	    		<el-option key="1" label="已解决" value="1"></el-option>
	    		<el-option key="2" label="已挂起" value="2"></el-option>
			  </el-select>
		  </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterExOrders.order_id" placeholder="订单编号"></el-input>
	      </el-form-item>		  
		  <el-form-item>
			  <el-select v-model="filterExOrders.ex_type" placeholder="异常类型" clearable>
	    		<el-option key="0" label="系统异常" value="0"></el-option>
	    		<el-option key="1" label="Ebay缺货" value="1"></el-option>
	    		<el-option key="2" label="卖家取消订单" value="2"></el-option>
			  </el-select>
		  </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterExOrders.handler" placeholder="处理人"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="getExOrders">查询</el-button>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="showAdd">新增</el-button>
	      </el-form-item>
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="exOrders" v-loading='exOrderLoading'  @current-change="setHighlight" height='600' style="width: 100%">
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="ex_id" label="异常编号" width='200'></el-table-column>
    	<el-table-column property="order_id" label="订单编号" width='200'></el-table-column>
    	<el-table-column prop="ex_type" label="异常类型" width="120" :filters="[{ text: '系统异常', value: 0 }, { text: 'Ebay缺货', value: 1 }, { text: '卖家取消订单', value: 2 }]" :filter-method="filterExTypeTag" filter-placement="bottom-end">
        	<template scope="scope">
            	<el-tag :type="scope.row.ex_type == 0 ? 'primary' : 'success'" close-transition>
            		<template v-if='scope.row.ex_type == 0'>
            			系统异常
            		</template>
            		<template v-else-if='scope.row.ex_type == 1'>
            			Ebay缺货
            		</template>
            		<template v-else-if='scope.row.ex_type == 2'>
            			卖家取消订单
            		</template>
            	</el-tag>
        	</template>
    	</el-table-column> 
    	<el-table-column prop="ex_status" label="异常状态" width="120" :filters="[{ text: '待解决', value: 0 }, { text: '已解决', value: 1 }, { text: '挂起', value: 2 }]" :filter-method="filterExStatusTag" filter-placement="bottom-end">
        	<template scope="scope">
            	<el-tag :type="scope.row.ex_status == 0 ? 'primary' : 'success'" close-transition>
            		<template v-if='scope.row.ex_status == 0'>
            			待解决
            		</template>
            		<template v-else-if='scope.row.ex_status == 1'>
            			已解决
            		</template>
            		<template v-else-if='scope.row.ex_status == 2'>
            			挂起
            		</template>
            	</el-tag>
        	</template>
    	</el-table-column>     	
    	<el-table-column property="ex_description" label="异常说明" width='300'></el-table-column>
    	<el-table-column label="解决说明" width='300'>
    		<template scope="scope">
    			{{ scope.row.handle_records.length == 0 ? "" : scope.row.handle_records[scope.row.handle_records.length -1].des  }}
    		</template>    		
    	</el-table-column>
    	<el-table-column label="最后处理人" width='130'>
    		<template scope="scope">
    			{{ scope.row.handle_records.length == 0 ? "" : scope.row.handle_records[scope.row.handle_records.length -1].handler }}
    		</template>      		
    	</el-table-column>
    	<el-table-column property="create_time" label="创建时间" width='150'></el-table-column>
    	<el-table-column label="最后更新时间" width='200'>
    		<template scope="scope">
    			{{ scope.row.handle_records.length == 0 ? "" : scope.row.handle_records[scope.row.handle_records.length -1].time }}
    		</template>    		
    	</el-table-column>
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
  import { reqGetExOrderList } from '../../api/api';

  export default{
    data(){
      return {
      	filterExOrders: {
      		ex_status: '',
      		ex_type: '',
      		order_id: '',
      		handler: ''
      	},
      	exOrders: [],
      	exOrderLoading: false,
      	total: 0,
      	page_size: 15,
      	exOrderPage: 1
      }
    },
    methods: {
      setHighlight(val) {
      	this.currentRow = val
      },
      filterExTypeTag(value, row) {
        return row.ex_type === value;
      },
      filterExStatusTag(value, row) {
      	return row.ex_status === value
      },
      setPageChange(val) {
      	this.exOrderPage = val
      	this.getExOrders()
      },
      //获取用户列表
      getExOrders() {

      	let params = {
      		page: this.exOrderPage,
      		page_size: this.page_size
      	}
      	Object.assign(params, this.filterExOrders)
  	    this.exOrderLoading = true
      	reqGetExOrderList(params).then((res) => {
      		this.total = res.data.total
      		this.exOrders = res.data.ex_orders
      		this.exOrderLoading = false
      	})
      },
      showEdit(row) {
      	this.$router.push({
      		name:'异常订单编辑',
      		params:{
      			ex_order: row
      		}
      	})
      },
      showDetail(row) {
      	this.$router.push({
      		name:'异常订单详情',
      		params:{
      			ex_order: row
      		}
      	})      	
      },
      showAdd() {
      	this.$router.push('/orderException/add')
      }
    },
    mounted() {
      this.getExOrders();
    }
  }
</script>
