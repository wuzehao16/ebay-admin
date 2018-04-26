<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
	  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
	    <el-form :inline="true" :model="filters">
	      <el-form-item>
	        <el-input v-model="filters.ebayItemid" placeholder="ItemId"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filters.productNane" placeholder="商品名称"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filters.userWxOpenid" placeholder="译者微信ID"></el-input>
	      </el-form-item>
        <el-form-item>
          <el-select v-model="filters.productStatus" placeholder="商品状态" clearable>
            <el-option key="0" label="正常" value="正常"></el-option>
            <el-option key="1" label="下架" value="下架"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
           <el-select v-model="filters.auditStatus" placeholder="审核状态" clearable>
            <el-option key="0" label="待审核" value="0"></el-option>
            <el-option key="1" label="已通过" value="1"></el-option>
            <el-option key="2" label="不通过" value="2"></el-option>            
          </el-select>
        </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="getGoods">查询</el-button>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="success" @click="showAdd">新增</el-button>
	      </el-form-item>
	    </el-form>
	  </el-col>
    <el-table ref="singleTable" :data="goods" v-loading='loading'  @current-change="setHighlight" style="width: 100%">
      <el-table-column property="productNane" label="商品名称" min-width='400'></el-table-column>      
    	<el-table-column property="productStatus" label="商品状态" min-width='100'></el-table-column>
      <el-table-column prop="auditStatus" label="审核状态" min-width="120" :filters="[{ text: '待审核', value: '0' }, { text: '已通过', value: '1' }, { text: '不通过', value: '2' }]" :filter-method="filterAuditTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <template v-if='scope.row.auditStatus == "0"'>
            <span style="color:red;">待审核</span>
          </template>
          <template v-else-if='scope.row.auditStatus == "1"'>
            已通过
          </template>
          <template v-else-if='scope.row.auditStatus == "2"'>
            不通过
          </template>
        </template>
    	</el-table-column>
    	<el-table-column property="userWxOpenid" label="译者微信ID" min-width="140"></el-table-column>

    	<el-table-column label="翻译时间" min-width="150">
          <template slot-scope="scope">
            {{ fTimestamp(scope.row.created) }}
          </template> 
      </el-table-column>
    	<el-table-column  label="审核时间" min-width="150">
          <template slot-scope="scope">
            {{ fTimestamp(scope.row.audited) }}
          </template>
      </el-table-column>
      <el-table-column prop="ebayItemid"  label="ebayItemId" min-width='160'></el-table-column>
	    <el-table-column label="操作" width='240' fixed="right">
        	<template slot-scope="scope">
              <template v-if="scope.row.auditStatus == '1'">
                  <el-button size="small" v-if="scope.row.productStatus == '下架'"
                      @click="onSale(scope.row)">上架</el-button>
                  <el-button size="small" type="danger" v-else
                      @click="offSale(scope.row)">下架</el-button>
              </template >
              <template v-else>
                  <el-button size="small" 
                      @click="onSale(scope.row)" disabled>上架</el-button>
              </template >
            	<el-button size="small" @click="goEdit(scope.row)">编辑</el-button>
            	<el-button size="small" type="primary" @click="goPreview(scope.row)" :disabled="scope.row.auditStatus != '0'">审核</el-button>
        	</template>
    	</el-table-column>
  	</el-table>
  	<!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-pagination layout="total, sizes, prev, pager, next" @current-change="setPageChange" @size-change="setSizeChange"  :page-size="filters.size" :total="totalGoods" style="float:right;">
        </el-pagination>
    </el-col>
    </el-col>
  </el-row>
</template>

<script>
import util from "../../common/util";
import { reqGoodsList, reqOnSaleGoods, reqOffSaleGoods } from "../../api";
export default {
  data() {
    return {
      filters: {
        ebayItemid: "",
        productNane: "",
        userWxOpenid: "",
        productStatus: "",
        auditStatus: "",
        page: 0,
        size: 10
      },
      goods: [],
      totalGoods: 0,
      loading: false
    };
  },
  methods: {
    onSale(row) {
      this.$confirm("确认上架该商品吗?", "提示", { type: "warning" })
        .then(() => {
          reqOnSaleGoods({productId: row.id}).then(res => {
            if (res.data.msg == "成功") {
              row.productStatus = "正常";
              this.$message({
                message: "该商品已成功上架",
                type: "success"
              });
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(e => {
          
        });
    },
    offSale(row) {
      this.$confirm("确认下架该商品吗?", "提示", { type: "warning" })
        .then(() => {
          reqOffSaleGoods({productId: row.id}).then(res => {
            if (res.data.msg == "成功") {
              row.productStatus = "下架";
              this.$message({
                message: "该商品已成功下架",
                type: "success"
              });
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(e => {
          
        });
    },
    goEdit(row) {
      this.$message({
        type: 'info',
        message: '编辑页面完善中......'
      })
/*      this.$router.push({
        name: "商品新增",
        params: {
          productId: row.id,
          ebayItemid: row.ebayItemid,
          userWxOpenid: row.userWxOpenid
        }
      });*/
    },
    goPreview(row) {
      this.$router.push({
        name: "商品预览",
        params: {
          product: row
        }
      });
    },
    setHighlight(val) {
      this.currentRow = val;
    },
    filterTag(value, row) {
      return row.goods_status === value;
    },
    filterAuditTag(value, row) {
      return row.auditStatus === value;
    },
    setSizeChange(val) {
      this.filters.size = val;
      this.getGoods();
    },
    setPageChange(val) {
      this.filters.page = val - 1;
      this.getGoods();
    },
    getGoods() {
      this.loading = true;
      reqGoodsList(this.filters)
        .then(res => {
          let re = res.data.data;
          if (re) {
            this.totalGoods = res.data.data.totalElements;
            this.goods = res.data.data.content;
          }

          

          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    showAdd() {
      this.$router.push("/goods/add");
    }
  },
  mounted() {
    this.getGoods();
  }
};
</script>
