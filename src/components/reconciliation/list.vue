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
	    <el-form :inline="true" :model="filters">
	      <el-form-item>
	        <el-input v-model="filters.tradeNo" placeholder="交易号"></el-input>
	      </el-form-item>		    
	      <el-form-item>
	        <el-input v-model="filters.userName" placeholder="用户姓名"></el-input>
	      </el-form-item>
     
	      <el-form-item label="核对状态">
			  <el-select v-model="filters.auditStatus" placeholder="核对状态" clearable>
	    		<el-option key="0" label="异常" value="0"></el-option>
	    		<el-option key="1" label="修复中" value="1"></el-option>
	    		<el-option key="2" label="正常" value="2"></el-option>
			  </el-select>
	      </el-form-item>
		  <el-form-item label="交易时间">
		    <el-date-picker v-model="trade_time" type="datetimerange"
		    :picker-options="pickerOptions" placeholder="选择时间范围" align="right">
		    </el-date-picker>		
		  </el-form-item>
<!-- 		  <el-form-item label="E-交易时间">
		    <el-date-picker v-model="filters.ebay_time" type="datetimerange" 
		    :picker-options="pickerOptions" placeholder="选择时间范围" align="right">
		    </el-date-picker>
		  </el-form-item>	 -->	  
	      <el-form-item>
	        <el-button type="primary" @click="getReconList">查询</el-button>
	      </el-form-item>
	  
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="re_list" v-loading='loading'  @current-change="setHighlight"  style="width: 100%">
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="tradeNo" label="交易号" width='120'></el-table-column>
    	<el-table-column label="交易类型" width='140'>
    		<template scope="scope">
        <template v-if="scope.row.accountItem">
          <template v-if="scope.row.accountItem.tradeType == '0'">收入</template>
          <template v-if="scope.row.accountItem.tradeType == '1'">支出</template>
          <template v-if="scope.row.accountItem.tradeType == '2'">提现</template>          
        </template>
    		</template>    		
    	</el-table-column>
    	<el-table-column property="user.userName" label="用户姓名" width='120'></el-table-column>

    	<el-table-column label="平台状态" width='140'>
    		<template scope="scope">
    			<template v-if="scope.row.platformStatus == '0'">处理中</template>
    			<template v-if="scope.row.platformStatus == '1'">成功</template>
    			<template v-if="scope.row.platformStatus == '2ebayStatus'">失败</template>
    		</template>
    	</el-table-column>
    	<el-table-column label="Ebay状态" width='140'>
    		<template scope="scope">
    			<template v-if="scope.row.ebayStatus == '0'">处理中</template>
    			<template v-if="scope.row.ebayStatus == '1'">成功</template>
    			<template v-if="scope.row.ebayStatus == '2'">失败</template>
    		</template>
    	</el-table-column>
    	<el-table-column property="platformAmount" label="平-交易金额（元）" width='160'></el-table-column>
    	<el-table-column property="ebayAmount" label="E-交易金额（元）" width='160'></el-table-column>
    	<el-table-column label="平-交易时间" width='200'>
          <template scope="scope">{{ fTimestamp(scope.row.platformTime) }}</template> 
      </el-table-column>
    	<el-table-column label="E-交易时间" width='200'>
          <template scope="scope">{{ fTimestamp(scope.row.ebayTime) }}</template> 
      </el-table-column>
      <el-table-column prop="handleMemo" label="处理意见" min-width='400'></el-table-column>
      <el-table-column prop="checkStatus" fixed="right" label="核对状态" width="120" :filters="[{ text: '异常', value: '0' }, { text: '修复中', value: '1' }, { text: '正常', value: '2' }]" :filter-method="filterTag" filter-placement="bottom-end">
          <template scope="scope">
            <template v-if="scope.row.checkStatus == '1'">
              <el-tag type='primary' close-transition>修复中</el-tag>
            </template>
            <template v-else-if="scope.row.checkStatus == '2'">
              <el-tag type='success' close-transition>正常</el-tag>
            </template>
            <template v-else>
              <el-tag type='danger' close-transition>异常</el-tag>
            </template>
          </template>
      </el-table-column>
	    <el-table-column fixed="right" label="操作" width='80'>
        	<template scope="scope">
            	<!-- <el-button v-if="" size="small" @click="showDetail(scope.row)">查看</el-button> -->
            	<el-button size="small" type="primary" 
            		@click="showEdit(scope.row)">处理</el-button>
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
import { reqCheckList } from "../../api";
import util from "../../common/util";
export default {
  data() {
    return {
      trade_time: "",
      filters: {
        tradeNo: "",
        userName: "",
        auditStatus: "",
        startDate: "",
        endDate: "",

        page: 0,
        size: 10
      },
      loading: false,
      total: 0,
      re_list: [],
      //选择时间相关
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
    filterTag(value, row) {
      if (value == "1" || value == "2") {
        return row.checkStatus == value;
      } else {
        return row.checkStatus != "1" && row.checkStatus != "2";
      }
    },
    setHighlight(val) {
      this.currentRow = val;
    },
    setSizeChange(val) {
      this.filters.size = size;
      this.getReconList();
    },
    setPageChange(val) {
      if (this.filters.page == val - 1) {
        return false;
      }
      this.filters.page = val - 1;
      this.getReconList();
    },
    getReconList() {
      this.loading = true;
      reqCheckList(this.filters).then(res => {
        
        let r = res.data.data;
        if (r) {
          this.total = r.total;
          this.re_list = r.content;
        }
        this.loading = false;
      });
    },
    showEdit(row) {
      
      this.$router.push({
        name: "对账处理",
        params: {
          reconciliation: row
        }
      });
    }
  },
  watch: {
    trade_time(val) {
      if (val[0]) {
        this.filters.startDate = this.fTimestamp(val[0]).substring(0, 10);
        this.filters.endDate = this.fTimestamp(val[1]).substring(0, 10);
      } else {
        this.filters.startDate = "";
        this.filters.endDate = "";
      }
    }
  },
  mounted() {
    this.getReconList();
  }
};
</script>

