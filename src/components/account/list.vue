<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>账户列表</el-breadcrumb-item>
        <el-breadcrumb-item>账户明细</el-breadcrumb-item>
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


    <el-table ref="singleTable" :data="accounts" v-loading='loading'  @current-change="setHighlight"  style="width: 100%" >
    	<el-table-column type="index" min-width="60"> </el-table-column>
    	<el-table-column property="userId" label="用户ID" min-width='200'></el-table-column>
    	<el-table-column property="user.userName" label="用户姓名" min-width='120'></el-table-column>
    	<el-table-column property="user.userPhone" label="手机号码" min-width='140'></el-table-column>
    	<el-table-column property="yIncome" label="昨日收益（元）" min-width='140'></el-table-column>
    	<el-table-column property="hIncome" label="历史收益（元）" min-width='140'></el-table-column>
    	<el-table-column property="userBalance" label="账户余额（元）" min-width='140'></el-table-column>
    	<el-table-column property="pIncome" label="待审核收益（元）" min-width='160'></el-table-column>
    	<el-table-column property="updated" label="更新时间" min-width='200' >
        <template slot-scope="scope">
					{{fTimestamp(scope.row.updated)}}
				</template>
      </el-table-column>
	    <el-table-column fixed="right" label="操作" min-width='80'>
        	<template slot-scope="scope">
            	<el-button size="small" type="primary" @click="showStated(scope.row)">明细</el-button>
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
import { reqGetAccountList } from "../../api/index";

export default {
  data() {
    return {
      filterAccounts: {
        userName: "",
        userPhone: "",
        data: [],
        startDate: "",
        endDate: ""
      },
      size: 20,
      loading: false,
      orderPage: 1,
      total: 0,
      accounts: [],
      //更新时间相关
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  methods: {
    dateFormat: function(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      let t = new Date(date);
      return t.toLocaleDateString();
    },
    setHighlight(val) {
      this.currentRow = val;
    },
    setSizeChange(val) {
      this.size = val;
      this.getAccounts();
    },
    setPageChange(val) {
      this.orderPage = val;
      this.getAccounts();
    },
    //获取分销结算列表
    getAccounts() {
      let pa = {
        page: this.orderPage - 1,
        size: this.size
      };
      if (
        this.filterAccounts.data &&
        this.filterAccounts.data.length > 0 &&
        this.filterAccounts.data[0] != null
      ) {
        this.filterAccounts.startDate = this.filterAccounts.data[0]
          .toJSON()
          .split("T")[0];
        this.filterAccounts.endDate = this.filterAccounts.data[1]
          .toJSON()
          .split("T")[0];
      } else {
        this.filterAccounts.startDate = "";
        this.filterAccounts.endData = "";
      }
      
      Object.assign(pa, this.filterAccounts);
      this.loading = true;

      reqGetAccountList(pa).then(res => {
        this.total = res.data.data.total;
        this.accounts = res.data.data.content;
        this.loading = false;
      });
    },
    showStated(row) {
      this.$router.push({
        name: "账户明细",
        params: {
          account: row
        }
      });
    }
  },
  mounted() {
    this.getAccounts();
  }
};
</script>

