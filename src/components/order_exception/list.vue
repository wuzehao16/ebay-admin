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
	        <el-input v-model="filterExOrders.orderNo" placeholder="订单编号"></el-input>
	      </el-form-item>		 
		  <el-form-item>
			  <el-select v-model="filterExOrders.errorStatus" placeholder="异常状态" clearable>
	    		<el-option key="0" label="待解决" value="0"></el-option>
	    		<el-option key="1" label="已解决" value="1"></el-option>
	    		<el-option key="2" label="未解决" value="2"></el-option>					
	    		<el-option key="3" label="已挂起" value="3"></el-option>
			  </el-select>
		  </el-form-item> 
		  <el-form-item>
			  <el-select v-model="filterExOrders.errorType" placeholder="异常类型" clearable>
	    		<el-option key="0" label="系统异常" value="0"></el-option>
	    		<el-option key="1" label="Ebay缺货" value="1"></el-option>
	    		<el-option key="2" label="卖家取消订单" value="2"></el-option>
			  </el-select>
		  </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterExOrders.handerby" placeholder="处理人"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="getExOrders">查询</el-button>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="success" @click="showAdd">新增</el-button>
	      </el-form-item>
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="exOrders" v-loading='exOrderLoading'  @current-change="setHighlight"  style="width: 100%">
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="errorNo" label="异常编号" width='200'></el-table-column>
    	<el-table-column property="orderNo" label="订单编号" width='200'></el-table-column>
    	<el-table-column prop="errorType" label="异常类型" width="120" :filters="[{ text: '系统异常', value: '0' }, { text: 'Ebay缺货', value: '1' }, { text: '卖家取消订单', value: '2' }]" :filter-method="filterExTypeTag" filter-placement="bottom-end">
        	<template scope="scope">
            		<template v-if='scope.row.errorType == "0"'>
            			系统异常
            		</template>
            		<template v-else-if='scope.row.errorType == "1"'>
            			Ebay缺货
            		</template>
            		<template v-else-if='scope.row.errorType == "2"'>
            			卖家取消订单
            		</template>
        	</template>
    	</el-table-column> 
    	<el-table-column prop="errorStatus" label="异常状态" width="120" :filters="[{ text: '待解决', value: '0' }, { text: '已解决', value: '1' },{ text: '未解决', value: '2' },  { text: '挂起', value: '3' }]" :filter-method="filterExStatusTag" filter-placement="bottom-end">
        	<template scope="scope">
            		<template v-if='scope.row.errorStatus == "0"'>
            			待解决
            		</template>
            		<template v-else-if='scope.row.errorStatus == "1"'>
            			已解决
            		</template>
            		<template v-else-if='scope.row.errorStatus == "2"'>
            			未解决
            		</template>
								<template v-else-if='scope.row.errorStatus == "3"'>
            			挂起
            		</template>
        	</template>
    	</el-table-column>     	
    	<el-table-column property="errorMemo" label="异常说明" width='300'></el-table-column>
    	<el-table-column property= "sloveMemo" label="解决说明" width='300'>  		
    	</el-table-column>
    	<el-table-column label="最后处理人" width='130' property="handerby">    		
    	</el-table-column>
    	<el-table-column label="创建时间" width='150' >
          <template scope="scope">
            {{ fTimestamp(scope.row.created) }}
          </template>
      </el-table-column>
    	<el-table-column label="最后更新时间" width='200' >
          <template scope="scope">
            {{ fTimestamp(scope.row.updated) }}
          </template>	
    	</el-table-column>
	    <el-table-column fixed="right" label="操作" width='220'>
        	<template scope="scope">
            	<el-button size="small" type="primary" @click='showDetail(scope.row)'>详情</el-button>
            	<el-button size="small" @click="showEdit(scope.row)">编辑</el-button>
            	<el-button size="small" type="danger" @click="deleteOrder(scope.row)">删除</el-button>							
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
import util from "../../common/util";
import { reqGetExOrderList, reqDeleteExOrder } from "../../api/index";

export default {
  data() {
    return {
      filterExOrders: {
        errorType: "",
        errorStatus: "",
        orderNo: "",
        handerby: ""
      },
      exOrders: [],
      exOrderLoading: false,
      total: 0,
      size: 15,
      exOrderPage: 1
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
    filterExTypeTag(value, row) {
      return row.errorStatus === value;
    },
    filterExStatusTag(value, row) {
      return row.errorType === value;
    },
    setSizeChange(val) {
      this.size = val;
      this.getExOrders();
    },
    setPageChange(val) {
      this.exOrderPage = val;
      this.getExOrders();
    },
    //获取用户列表
    getExOrders() {
      let params = {
        page: this.exOrderPage - 1,
        size: this.size
      };
      Object.assign(params, this.filterExOrders);
      this.exOrderLoading = true;
      reqGetExOrderList(params).then(res => {
        this.total = res.data.data.totalElements;
        this.exOrders = res.data.data.content;
        console.log(this.exOrders);
        this.exOrderLoading = false;
      });
    },
    showEdit(row) {
      console.log(row);
      this.$router.push({
        name: "异常订单编辑",
        params: {
          ex_order: row
        }
      });
    },
    showDetail(row) {
      this.$router.push({
        name: "异常订单详情",
        params: {
          ex_order: row
        }
      });
    },
    showAdd() {
      this.$router.push("/orderException/add");
    },
    //删除异常订单
    deleteOrder(row) {
      let params = { id: row.id };
      this.$confirm("是否删除异常订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        reqDeleteExOrder(params).then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "删除异常订单成功!"
            });
            this.getExOrders();
          } else {
            console.log(1);
            let action = res.data.msg;
            this.$alert(`${action}`, "提示", {
              confirmButtonText: "确定"
            });
          }
        });
      });
    }
  },
  mounted() {
    this.getExOrders();
  }
};
</script>
