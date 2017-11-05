<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>对账管理</el-breadcrumb-item>
        <el-breadcrumb-item>对账列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

	  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
	    <el-form :inline="true" :model="filter">
	      <el-form-item>
	        <el-input v-model="filter.trade_id" placeholder="交易号"></el-input>
	      </el-form-item>		    
	      <el-form-item>
	        <el-input v-model="filter.user_name" placeholder="用户姓名"></el-input>
	      </el-form-item>
     
	      <el-form-item label="核对状态">
			  <el-select v-model="filter.reconc_status" placeholder="核对状态" clearable>
	    		<el-option key="0" label="异常" value="0"></el-option>
	    		<el-option key="1" label="修复中" value="1"></el-option>
	    		<el-option key="2" label="正常" value="2"></el-option>
			  </el-select>
	      </el-form-item>
		  <el-form-item label="平-交易时间">
		    <el-date-picker v-model="filter.platform_time" type="datetimerange" 
		    :picker-options="pickerOptions" placeholder="选择时间范围" align="right">
		    </el-date-picker>		
		  </el-form-item>
		  <el-form-item label="E-交易时间">
		    <el-date-picker v-model="filter.ebay_time" type="datetimerange" 
		    :picker-options="pickerOptions" placeholder="选择时间范围" align="right">
		    </el-date-picker>
		  </el-form-item>		  
	      <el-form-item>
	        <el-button type="primary" @click="getReconList">查询</el-button>
	      </el-form-item>
	  
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="re_list" v-loading='loading'  @current-change="setHighlight" height='600' style="width: 100%">
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="trade_id" label="交易号" width='200'></el-table-column>
    	<el-table-column label="交易类型" width='140'>
    		<template scope="scope">
    			<template v-if="scope.row.trade_type == 0">收入</template>
    			<template v-if="scope.row.trade_type == 1">支出</template>
    		</template>    		
    	</el-table-column>
    	<el-table-column property="user_name" label="用户姓名" width='120'></el-table-column>
    	<el-table-column label="平台状态" width='140'>
    		<template scope="scope">
    			<template v-if="scope.row.platform_status == 0">处理中</template>
    			<template v-if="scope.row.platform_status == 1">成功</template>
    			<template v-if="scope.row.platform_status == 2">失败</template>
    		</template>
    	</el-table-column>
    	<el-table-column label="Ebay状态" width='140'>
    		<template scope="scope">
    			<template v-if="scope.row.ebay_status == 0">处理中</template>
    			<template v-if="scope.row.ebay_status == 1">成功</template>
    			<template v-if="scope.row.ebay_status == 2">失败</template>
    		</template>
    	</el-table-column>
    	<el-table-column property="platform_amount" label="平-交易金额（元）" width='140'></el-table-column>
    	<el-table-column property="ebay_amount" label="E-交易金额（元）" width='140'></el-table-column>
    	<el-table-column property="platform_time" label="平-交易时间" width='200'></el-table-column>
    	<el-table-column property="ebay_time" label="E-交易时间" width='200'></el-table-column>

    	<el-table-column fixed="right" label="核对状态" width='120'>
    		<template scope="scope">
    			<template v-if="scope.row.reconc_status == 0">异常</template>
    			<template v-if="scope.row.reconc_status == 1">修复中</template>
    			<template v-if="scope.row.reconc_status == 2">正常</template>
    		</template>
    	</el-table-column>
	    <el-table-column fixed="right" label="操作" width='80'>
        	<template scope="scope">
            	<!-- <el-button v-if="" size="small" @click="showDetail(scope.row)">查看</el-button> -->
            	<el-button size="small" type="primary" 
            		@click="showEdit(scope.row)" v-if="scope.row.reconc_status != 2">处理</el-button>
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
  import {  reqReconciliationList } from '../../api/api';

  export default{
    data(){
      return {
        filter: {
        	trade_id: '',
        	user_name: '',
        	reconc_status: '',
        	platform_time: '',
        	ebay_time: ''
        },
        page_size: 20,
        loading: false,
        orderPage: 1,
        total: 0,
        re_list: [],
        //选择时间相关
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },         
      }
    },
    methods: {
      setHighlight(val) {
      	this.currentRow = val
      },
      setPageChange(val) {
      	this.orderPage = val
      	this.getReconList()
      },
      getReconList() {
      	let pa = {
      		page: this.orderPage,
      		page_size: this.page_size
      	}
      	Object.assign(pa, this.filter)
 	    this.loading = true
		reqReconciliationList(pa).then((res) => {
			this.total = res.data.total
			this.re_list = res.data.re_list
      		this.loading = false
		})
      },
      showEdit(row) {
      	this.$router.push({
      		name: '对账处理',
      		params: {
      			reconciliation: row
      		}
      	})
      }
    },
    mounted() {
      this.getReconList();


    }
  }
</script>

