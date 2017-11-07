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
	    <el-form :inline="true" :model="filters">
	      <el-form-item>
	        <el-input v-model="filters.orderNo" placeholder="订单编号"></el-input>
	      </el-form-item>	     
	      <el-form-item>
	        <el-input v-model="filters.productName" placeholder="商品名称"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filters.buyUserName" placeholder="用户姓名"></el-input>
	      </el-form-item>
		  <el-form-item>
			  <el-select v-model="filters.auditStatus" placeholder="订单状态" clearable>
	    		<el-option key="0" label="待审核" value="0"></el-option>
	    		<el-option key="1" label="未通过" value="1"></el-option>
	    		<el-option key="2" label="已通过" value="2"></el-option>
	    		<el-option key="3" label="作废" value="3"></el-option>
			  </el-select>
		  </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="getPlaces">查询</el-button>
	      </el-form-item>
	  
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="places" v-loading='loading'  @current-change="setHighlight" height='600' style="width: 100%">
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="orderNo" label="订单编号" width='200'></el-table-column>
    	<el-table-column property="productName" label="商品名称" width='150'></el-table-column>
    	<el-table-column property="productTotalPrice" label="总价（元）" width='120'></el-table-column>
      <el-table-column prop="buyUserName" label="买家姓名" width="120"></el-table-column>
    	<el-table-column label="一级/提成（元）" width='160'>
    		<template scope="scope">
    			{{ scope.row.firstDistName }}/
    			{{ scope.row.firstCommission }}
    		</template>
    	</el-table-column>
    	<el-table-column label="二级/提成（元）" width='160'>
    		<template scope="scope">
          {{ scope.row.secondDistName }}/
          {{ scope.row.secondCommission }}
    		</template>
    	</el-table-column>
    	<el-table-column prop="totalCommission" label="总提成（元）" width='120'></el-table-column>
  
    	<el-table-column prop="auditStatus" label="审核结算" width="120" :filters="[{ text: '待审核', value: '0' }, { text: '未通过', value: '1' }, { text: '已通过', value: '2' }, { text: '作废', value: '3' }]" :filter-method="filterSettleStatusTag" filter-placement="bottom-end">
        	<template scope="scope">
          <el-tag type="info" v-if="scope.row.auditStatus == '0'">待审核</el-tag>
          <el-tag type="warning" v-if="scope.row.auditStatus == '1'">未通过</el-tag>
          <el-tag type="success" v-if="scope.row.auditStatus == '2'">已通过</el-tag>
          <el-tag type="danger" v-if="scope.row.auditStatus == '3'">作废</el-tag>
        	</template>
    	</el-table-column>
    	<el-table-column  label="结算时间" width='150'>
        <template scope="scope">
         {{ fTimestamp(scope.row.created) }}
        </template>
      </el-table-column>
    	<el-table-column  label="付款时间" width='150'>
        <template scope="scope">
         {{ fTimestamp(scope.row.updated) }}
        </template>        
      </el-table-column>
	    <el-table-column fixed="right" label="操作" width='160'>
        	<template scope="scope">
            	<el-button size="small" type="primary" @click="showEdit(scope.row)">编辑</el-button>
            	<el-button size="small" @click="showSettle(scope.row)">审核</el-button>
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
import { reqDistrList } from '../../api';

export default {
  data() {
    return {
      filters: {
        orderNo: "",
        productName: "",
        buyUserName: "",
        auditStatus: "",
        page: 0,
        size: 20
      },
      loading: false,
      total: 0,
      places: []
    };
  },
  methods: {
    setHighlight(val) {
      this.currentRow = val;
    },
    filterSettleStatusTag(value, row) {
      return row.auditStatus == value;
    },
    setSizeChange(val) {
      this.filters.size = val;
      this.getPlaces();
    },
    setPageChange(val) {
      this.filters.page = val - 1;
      this.getPlaces();
    },
    //获取分销结算列表
    getPlaces() {
      this.loading = true;
      reqDistrList(this.filters)
        .then(res => {
          let p = res.data.data;
          if (p) {
            this.total = p.totalElements;
            this.places = p.content;
            console.log("kdjfdkf", this.places);
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    showEdit(row) {
      this.$router.push({
        name: "结算审核",
        params: {
          id: row.id,
          isEdit: true
        }
      });
    },
    showSettle(row) {
      this.$router.push({
        name: "结算审核",
        params: {
          id: row.id
        }
      });
    }
  },
  mounted() {
    this.getPlaces();
  }
};
</script>

