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
	        <el-input v-model="filterAccounts.userName" placeholder="用户姓名"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterAccounts.userPhone" placeholder="手机号码"></el-input>
	      </el-form-item>	     
		  <el-form-item>
		    <el-date-picker v-model="filterAccounts.data" type="datetimerange" 
		    :picker-options="pickerOptions" placeholder="选择时间范围" align="right">
		    </el-date-picker>		
		  </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="getAccounts">查询</el-button>
	      </el-form-item>
	  
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="accounts" v-loading='loading'  @current-change="setHighlight" height='600' style="width: 100%" >
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="userId" label="用户ID" width='200'></el-table-column>
    	<el-table-column property="user.userName" label="用户姓名" width='120'></el-table-column>
    	<el-table-column property="user.userPhone" label="手机号码" width='140'></el-table-column>
    	<el-table-column property="yIncome" label="昨日收益（元）" width='140'></el-table-column>
    	<el-table-column property="hIncome" label="历史收益（元）" width='140'></el-table-column>
    	<el-table-column property="userBalance" label="账户余额（元）" width='140'></el-table-column>
    	<el-table-column property="pIncome" label="待审核收益（元）" width='160'></el-table-column>
    	<el-table-column property="updated" label="更新时间" width='200' :formatter="dateFormat"></el-table-column>
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
  import {  reqGetAccountList } from '../../api/index';

  export default{
    data(){
      return {
        filterAccounts: {
        	userName: '',
          userPhone: '',
          data:[],
        	udpateDate: ""
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
      setPageChange(val) {
      	this.orderPage = val
      	this.getAccounts()
      },
      //获取分销结算列表
      getAccounts() {

      	let pa = {
      		page: this.orderPage -1,
      		page_size: this.page_size
        }
        if(this.filterAccounts.data && this.filterAccounts.data.length >0){
        this.filterAccounts.udpateDate = this.filterAccounts.data[0].getTime()+'-'+this.filterAccounts.data[1].getTime()
        }
      	Object.assign(pa, this.filterAccounts)
  	    this.loading = true
	  
		reqGetAccountList(pa).then((res) => {
			this.total = res.data.total
			this.accounts = res.data.data.content
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

