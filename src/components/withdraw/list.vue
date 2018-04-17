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
	    <el-form :inline="true" :model="filters">
	      <el-form-item>
	        <el-input v-model="filters.userName" placeholder="用户姓名"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filters.userPhone" placeholder="手机号码"></el-input>
	      </el-form-item>	     
	      <el-form-item label="审核状态">
			  <el-select v-model="filters.auditStatus" placeholder="审核状态" clearable>
	    		<el-option key="0" label="待审核" value="0"></el-option>
	    		<el-option key="1" label="已通过" value="1"></el-option>
	    		<el-option key="2" label="不通过" value="2"></el-option>
	    		<el-option key="3" label="暂不处理" value="3"></el-option>
			  </el-select>
	      </el-form-item>
	      <el-form-item label="危险系数">
			  <el-select v-model="filters.perilRatio" placeholder="危险系数" clearable>
          <el-option key="0" label="正常" value="0"></el-option>
	    		<el-option key="1" label="低" value="1"></el-option>
	    		<el-option key="2" label="中" value="2"></el-option>
	    		<el-option key="3" label="高" value="3"></el-option>
			  </el-select>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="getWithdrawList">查询</el-button>
	      </el-form-item>
	  
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="withdraw_list" v-loading='loading'  @current-change="setHighlight" style="width: 100%">
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="tradeNo" label="交易号" width='200'></el-table-column>
    	<el-table-column property="user.userName" label="用户姓名" width='120'></el-table-column>
    	<el-table-column property="user.userPhone" label="手机号码" width='140'></el-table-column>
    	<el-table-column label="交易状态" width='140'>
    		<template slot-scope="scope">
          <template v-if="scope.row.accountItem">
            <template v-if="scope.row.accountItem.tradeStatus == '0'">失败</template>
            <template v-if="scope.row.accountItem.tradeStatus == '1'">成功</template>
            <template v-if="scope.row.accountItem.tradeStatus == '2'">处理中</template>             
          </template>
    		</template>
    	</el-table-column>
    	<el-table-column property="drawAmount" label="提现金额（元）" width='140'></el-table-column>
    	<el-table-column label="危险系数" width='100'>
    		<template slot-scope="scope">
          <template v-if="scope.row.perilRatio == '0'">正常</template>
    			<template v-if="scope.row.perilRatio == '1'">低</template>
    			<template v-if="scope.row.perilRatio == '2'">中</template>
    			<template v-if="scope.row.perilRatio == '3'">高</template>
    		</template>
    	</el-table-column>       	
    	<el-table-column label="审核状态" width='140'>
    		<template slot-scope="scope">
    			<template v-if="scope.row.auditStatus == '0'">待审核</template>
    			<template v-if="scope.row.auditStatus == '1'">已通过</template>
    			<template v-if="scope.row.auditStatus == '2'">不通过</template>
    			<template v-if="scope.row.auditStatus == '3'">暂不处理</template>
    		</template>
    	</el-table-column>       	
    	<el-table-column label="发放状态" width='140'>
    		<template slot-scope="scope">
    			<template v-if="scope.row.issue_status == 0">未发放</template>
    			<template v-if="scope.row.issue_status == 1">已发放</template>
    		</template>
    	</el-table-column>
    	<el-table-column label="申请时间" width='200'>
        <template slot-scope="scope">
          {{ fTimestamp(scope.row.created) }}
        </template> 
      </el-table-column>
    	<el-table-column label="到账时间" width='200'>
        <template slot-scope="scope">
            <template v-if="scope.row.accountItem">
              <template v-if="scope.row.accountItem.tradeStatus == '1'">
                {{ fTimestamp(scope.row.accountItem.updated) }}
              </template>
            </template>
            <template v-else>--</template>
        </template>
      </el-table-column>
	    <el-table-column fixed="right" label="操作" width='240'>
        	<template slot-scope="scope">
            	<el-button size="small" @click="showAudit(scope.row, true)">查看</el-button>
            	<el-button :disabled="scope.row.auditStatus != '0'" size="small" type="primary" 
            		@click="showAudit(scope.row)">审核</el-button>
            	<el-button :disabled="!(scope.row.audit_status == 1 && scope.row.issue_status == 0)" 
            		size="small" type="primary" 
            		@click="issueWithdraw(scope.row)">发放</el-button>
        	</template>
    	</el-table-column>
  	</el-table>

  	<!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-pagination layout="total, sizes, prev, pager, next" @current-change="setPageChange" @size-change="setSizeChange" :page-size="filters.size" :total="total" style="float:right;">
        </el-pagination>
    </el-col>
    </el-col>
  </el-row>
</template>
<script>
import { reqWithdrawList } from "../../api";
export default {
  data() {
    return {
      filters: {
        userName: "",
        userPhone: "",
        auditStatus: "",
        perilRatio: "",

        page: 0,
        size: 10
      },
      loading: false,
      total: 0,
      withdraw_list: []
    };
  },
  methods: {
    setHighlight(val) {
      this.currentRow = val;
    },
    setSizeChange(val) {
      this.filters.size = val;
      this.getWithdrawList();
    },
    setPageChange(val) {
      this.filters.page = val - 1;
      this.getWithdrawList();
    },
    getWithdrawList() {
      this.loading = true;
      reqWithdrawList(this.filters).then(res => {
        let w = res.data.data;
        if (w) {
          
          this.total = w.total;
          this.withdraw_list = w.content;
          this.loading = false;
        }
      });
    },
    issueWithdraw(row) {
      reqGetWithdrawIssue(row).then(res => {
        
        this.$message({
          message: "提交成功",
          type: "success"
        });
        row.issue_status = 1;
      });
    },
    showAudit(row, isDetail) {
      let d = row;
      d.created = this.fTimestamp(d.created);
      
      this.$router.push({
        name: "提现审核",
        params: {
          withdraw_info: d,
          isDetail: isDetail
        }
      });
    }
  },
  mounted() {
    this.getWithdrawList();
  }
};
</script>

