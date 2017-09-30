<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>提现管理</el-breadcrumb-item>
        <el-breadcrumb-item>提现列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

	  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
	    <el-form :inline="true" :model="filterWithdraw">
	      <el-form-item>
	        <el-input v-model="filterWithdraw.user_name" placeholder="用户姓名"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterWithdraw.tel" placeholder="手机号码"></el-input>
	      </el-form-item>	     
	      <el-form-item label="审核状态">
			  <el-select v-model="filterWithdraw.audit_status" placeholder="审核状态" clearable>
	    		<el-option key="0" label="待审核" value="0"></el-option>
	    		<el-option key="1" label="已通过" value="1"></el-option>
	    		<el-option key="2" label="不通过" value="2"></el-option>
	    		<el-option key="3" label="暂不处理" value="3"></el-option>
			  </el-select>
	      </el-form-item>
	      <el-form-item label="危险系数">
			  <el-select v-model="filterWithdraw.risk_factor" placeholder="危险系数" clearable>
	    		<el-option key="0" label="低" value="0"></el-option>
	    		<el-option key="1" label="中" value="1"></el-option>
	    		<el-option key="2" label="高" value="2"></el-option>
			  </el-select>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="getWithdrawList">查询</el-button>
	      </el-form-item>
	  
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="withdraw_list" v-loading='loading' highlight-current-row @current-change="setHighlight" height='600' style="width: 100%">
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="withdraw_id" label="交易号" width='200'></el-table-column>
    	<el-table-column property="user_name" label="用户姓名" width='120'></el-table-column>
    	<el-table-column property="tel" label="手机号码" width='140'></el-table-column>
    	<el-table-column label="交易状态" width='140'>
    		<template scope="scope">
    			<template v-if="scope.row.withdraw_status == 0">处理中</template>
    			<template v-if="scope.row.withdraw_status == 1">成功</template>
    			<template v-if="scope.row.withdraw_status == 2">失败</template>
    		</template>
    	</el-table-column>
    	<el-table-column property="withdraw_amount" label="提现金额（元）" width='140'></el-table-column>
    	<el-table-column label="危险系数" width='100'>
    		<template scope="scope">
    			<template v-if="scope.row.risk_factor == 0">低</template>
    			<template v-if="scope.row.risk_factor == 1">中</template>
    			<template v-if="scope.row.risk_factor == 2">高</template>
    		</template>
    	</el-table-column>       	
    	<el-table-column label="审核状态" width='140'>
    		<template scope="scope">
    			<template v-if="scope.row.audit_status == 0">待审核</template>
    			<template v-if="scope.row.audit_status == 1">已通过</template>
    			<template v-if="scope.row.audit_status == 2">不通过</template>
    			<template v-if="scope.row.audit_status == 3">暂不处理</template>
    		</template>
    	</el-table-column>       	
    	<el-table-column label="发放状态" width='140'>
    		<template scope="scope">
    			<template v-if="scope.row.issue_status == 0">未发放</template>
    			<template v-if="scope.row.issue_status == 1">已发放</template>
    		</template>
    	</el-table-column>
    	<el-table-column property="apply_time" label="申请时间" width='200'></el-table-column>
    	<el-table-column property="collected_time" label="到账时间" width='200'></el-table-column>
	    <el-table-column fixed="right" label="操作" width='160'>
        	<template scope="scope">
            	<el-button size="small" @click="showDetail(scope.row)">查看</el-button>
            	<el-button v-if="scope.row.audit_status == 0" size="small" type="primary" 
            		@click="showAudit(scope.row)">审核</el-button>
            	<el-button v-if="scope.row.audit_status == 1 && scope.row.issue_status == 0" 
            		size="small" type="primary" 
            		@click="issueWithdraw(scope.row)">发放</el-button>
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
  import {  reqGetWithdrawList, reqGetWithdrawIssue } from '../../api/api';

  export default{
    data(){
      return {
        filterWithdraw: {
        	user_name: '',
        	tel: '',
        	audit_status: '',
        	risk_factor: ''
        },
        page_size: 20,
        loading: false,
        orderPage: 1,
        total: 0,
        withdraw_list: []
      }
    },
    methods: {
      setHighlight(val) {
      	this.currentRow = val
      },
      setPageChange(val) {
      	this.orderPage = val
      	this.getWithdrawList()
      },
      getWithdrawList() {
      	let pa = {
      		page: this.orderPage,
      		page_size: this.page_size
      	}
      	Object.assign(pa, this.filterWithdraw)
 	    this.loading = true
		reqGetWithdrawList(pa).then((res) => {
			this.total = res.data.total
			this.withdraw_list = res.data.withdraw_list
      		this.loading = false
		})
      },
      issueWithdraw(row) {
    	reqGetWithdrawIssue(row).then((res) => {
    		console.log(res)
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            row.issue_status = 1  
    	})

      },
      showAudit(row) {
      	this.$router.push({
      		name: '提现审核',
      		params: {
      			withdraw_info: row
      		}
      	})
      },
      showDetail(row) {
      	this.$router.push({
      		name: '提现详情',
      		params: {
      			withdraw_info: row
      		}
      	})      	
      }
    },
    mounted() {
      this.getWithdrawList();
    }
  }
</script>

