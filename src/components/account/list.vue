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
	    <el-form :inline="true" :model="filterAccounts">
	      <el-form-item>
	        <el-input v-model="filterAccounts.user_name" placeholder="用户姓名"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterAccounts.tel" placeholder="手机号码"></el-input>
	      </el-form-item>	     
	      <el-form-item label="待审核收益（元）大于：">
	        <el-input v-model.number="filterAccounts.little_cpe" placeholder="待审核收益（元）"></el-input>
	      </el-form-item>
	      <el-form-item label="待审核收益（元）小于：">
	        <el-input v-model.number="filterAccounts.greater_cpe" placeholder="待审核收益（元）"></el-input>
	      </el-form-item>
		  <el-form-item>
		    <el-date-picker v-model="filterAccounts.update_time" type="datetimerange" 
		    :picker-options="pickerOptions" placeholder="选择时间范围" align="right">
		    </el-date-picker>		
		  </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="getAccounts">查询</el-button>
	      </el-form-item>
	  
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="accounts" v-loading='loading' highlight-current-row @current-change="setHighlight" height='600' style="width: 100%">
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="user_id" label="用户ID" width='200'></el-table-column>
    	<el-table-column property="user_name" label="用户姓名" width='120'></el-table-column>
    	<el-table-column property="tel" label="手机号码" width='140'></el-table-column>
    	<el-table-column property="earnings_yesterday" label="昨日收益（元）" width='140'></el-table-column>
    	<el-table-column property="earnings_history" label="历史收益（元）" width='140'></el-table-column>
    	<el-table-column property="account_balance" label="账户余额（元）" width='140'></el-table-column>
    	<el-table-column property="check_pending_earnings" label="待审核收益（元）" width='160'></el-table-column>
    	<el-table-column property="update_time" label="更新时间" width='200'></el-table-column>
	    <el-table-column fixed="right" label="操作" width='80'>
        	<template scope="scope">
            	<el-button size="small" type="primary" @click="showStated(scope.row)">明细</el-button>
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
  import {  reqGetAccountList } from '../../api/api';

  export default{
    data(){
      return {
        filterAccounts: {
        	user_name: '',
        	tel: '',
        	little_cpe: '',
        	greater_cpe: '',
        	update_time: ''
        },
        page_size: 20,
        loading: false,
        orderPage: 1,
        total: 0,
        accounts: [],
        //更新时间相关
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
      	this.getAccounts()
      },
      //获取分销结算列表
      getAccounts() {

      	let pa = {
      		page: this.orderPage,
      		page_size: this.page_size
      	}
      	Object.assign(pa, this.filterAccounts)
  	    this.loading = true
	  
		reqGetAccountList(pa).then((res) => {
			this.total = res.data.total
			this.accounts = res.data.accounts
      		this.loading = false
		})
      },
      showStated(row) {
      	this.$router.push({
      		name:'账户明细',
      		params:{
      			account: row
      		}
      	})
      }
    },
    mounted() {
      this.getAccounts();
    }
  }
</script>

