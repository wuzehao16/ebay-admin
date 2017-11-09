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
	      <el-form-item label="用户姓名">
	        <el-input v-model="filterAccounts.userName" placeholder="用户姓名"></el-input>
	      </el-form-item>
	      <el-form-item label="手机号码">
	        <el-input v-model="filterAccounts.userPhone" placeholder="手机号码"></el-input>
	      </el-form-item>	     
		  <el-form-item label="交易状态">
			  <el-select v-model="filterAccounts.tradeStatus" placeholder="交易状态" clearable>
	    		<el-option key="0" label="处理中" value="0"></el-option>
	    		<el-option key="1" label="成功" value="1"></el-option>
	    		<el-option key="2" label="失败" value="2"></el-option>
			  </el-select>
		  </el-form-item>	 

		  <el-form-item>
		    <el-date-picker v-model="filterAccounts.date" type="datetimerange" 
		    :picker-options="pickerOptions" placeholder="选择时间范围" align="right">
		    </el-date-picker>		
		  </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="getAccounts">查询</el-button>
	      </el-form-item>
	  
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="accounts" v-loading='loading'  @current-change="setHighlight"  style="width: 100%">
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="user.userName" label="用户姓名" width='140'></el-table-column>
    	<el-table-column property="user.userPhone" label="手机号码" width='140'></el-table-column>
    	<el-table-column property="tradeInAmount" label="收入（元）" width='140'></el-table-column>
    	<el-table-column property="tradeOutAmount" label="支出（元）" width='140'></el-table-column>
    	<el-table-column property="userBalance" label="账户余额（元）" width='140'></el-table-column>
    	<el-table-column label="交易状态" width='100'>
    		<template scope="scope">
    			<template v-if="scope.row.tradeStatus == 0">
    			处理中
    			</template>
    			<template v-if="scope.row.tradeStatus == 1">
    			成功
    			</template>
    			<template v-if="scope.row.tradeStatus == 2">
    			失败
    			</template>
    		</template>
    	</el-table-column>
    	<!-- <el-table-column property="des" label="额度说明" width="240"></el-table-column> -->
    	<el-table-column  label="交易时间" width='200'>
				<template scope="scope">
					{{fTimestamp(scope.row.created)}}
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
import { reqGetAccountSteted } from "../../api/index";

export default {
  data() {
    return {
      id: "",
      filterAccounts: {
        userName: "",
        userPhone: "",
        tradeStatus: "",
        date: "",
        startDate:"",
        endDate:""
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
    setHighlight(val) {
      this.currentRow = val;
    },
    setPageChange(val) {
      this.orderPage = val;
      this.getAccounts();
    },
    setSizeChange(val) {
      this.size = val;
      this.getAccounts();
    },
    //获取分销结算列表
    getAccounts() {
      let pa = {
        page: this.orderPage - 1,
        size: this.size
      };
      if (
        this.filterAccounts.date &&
        this.filterAccounts.date.length > 0 &&
        this.filterAccounts.date[0] != null
      ) {
        this.filterAccounts.startDate = this.filterAccounts.date[0]
          .toJSON()
          .split("T")[0];
        this.filterAccounts.endDate = this.filterAccounts.date[1]
          .toJSON()
          .split("T")[0];
        console.log(this.filterAccounts)
      } else {
        this.filterAccounts.startDate = "";
        this.filterAccounts.endDate = "";
      }
      Object.assign(pa, { id: this.id });
      Object.assign(pa, this.filterAccounts);
      this.loading = true;
      console.log(pa);
      reqGetAccountSteted(pa).then(res => {
        this.total = res.data.total;
        console.log(res);
        this.accounts = res.data.data.content;
        this.loading = false;
      });
    }
  },
  mounted() {
    if (this.$route.params.account) {
      this.filterAccounts.userName = this.$route.params.account.userName;
      this.filterAccounts.userPhone = this.$route.params.account.userPhone;
      this.id = this.$route.params.account.id;
      this.getAccounts();
    }
  }
};
</script>

