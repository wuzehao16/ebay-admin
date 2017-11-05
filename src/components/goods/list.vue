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
	        <el-input v-model="filters.item_id" placeholder="ItemId"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filters.productNane" placeholder="商品名称"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filters.userWxOpenid" placeholder="译者微信ID"></el-input>
	      </el-form-item>
		  <el-select v-model="filters.productStatus" placeholder="商品状态" clearable>
    		<el-option key="0" label="正常" value="正常"></el-option>
    		<el-option key="1" label="下架" value="下架"></el-option>
		  </el-select>
	      <el-form-item>
	        <el-button type="primary" @click="getGoods">查询</el-button>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="showAdd">新增</el-button>
	      </el-form-item>
	    </el-form>
	  </el-col>
    <el-table ref="singleTable" :data="goods" v-loading='loading'  @current-change="setHighlight" style="width: 100%">
    	<el-table-column property="id" label="商品编号" width='100'></el-table-column>
    	<el-table-column  label="ItemId" width='100'>
        <template scope="scope">
          无。。。
        </template> 
      </el-table-column>
      <el-table-column property="productNane" label="商品名称" width='200'></el-table-column>
    	<el-table-column property="productStatus" label="商品状态" width='100'></el-table-column>
    	<el-table-column property="userWxOpenid" label="译者微信ID" width="140"></el-table-column>
    	<el-table-column prop="auditStatus" label="审核状态" width="120" :filters="[{ text: '待审核', value: '0' }, { text: '已通过', value: '1' }, { text: '不通过', value: '2' }]" :filter-method="filterAuditTag" filter-placement="bottom-end">
        	<template scope="scope">
        		<template v-if='scope.row.auditStatus == "0"'>
        			<el-tag type='primary'>待审核</el-tag>
        		</template>
        		<template v-else-if='scope.row.auditStatus == "1"'>
        			<el-tag type='success'>已通过</el-tag>
        		</template>
        		<template v-else-if='scope.row.auditStatus == "2"'>
        			<el-tag type='warning'>不通过</el-tag>
        		</template>
        	</template>
    	</el-table-column>
    	<el-table-column label="翻译时间" width="150">
          <template scope="scope">
            {{ scope.row.created ? formatDate(scope.row.created) : '--' }}
          </template> 
      </el-table-column>
    	<el-table-column  label="审核时间">
          <template scope="scope">
            {{ scope.row.updated ? formatDate(scope.row.updated) : '--' }}
          </template>
      </el-table-column>
	    <el-table-column label="操作" width='240' fixed="right">
        	<template scope="scope">
          <template v-if="scope.row.auditStatus == '1'">
              <el-button size="small" v-if="scope.row.productStatus == '下架'"
                  @click="onSale(scope.row)">上架</el-button>
              <el-button size="small" type="danger" v-else
                  @click="offSale(scope.row)">下架</el-button>
          </template>
            	<el-button size="small" @click="goEdit(scope.row.id)">编辑</el-button>
            	<el-button size="small" type="primary" @click="goPreview(scope.row)">审核</el-button>
        	</template>
    	</el-table-column>
  	</el-table>
  	<!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="setPageChange" :page-size="filters.size" :total="totalGoods" style="float:right;">
        </el-pagination>
    </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import util from '../../common/util'
  import { reqGoodsList, reqOnSaleGoods, reqOffSaleGoods } from '../../api/api';
  export default{
    data(){
      return {
        filters: {
        	item_id: '',
        	productNane: '',
        	userWxOpenid: '',
        	productStatus: '',
          page: 0,
          size: 15
        },
        goods: [],
        totalGoods: 0,
        loading: false,
      }
    },
    methods: {
      onSale(row) {
        this.$confirm('确认上架该商品吗?', '提示', {type: 'warning'}).then(() => {
          reqOnSaleGoods(row.id).then((res) => {
            if (res.data.msg == '成功') {
              row.productStatus = '正常'
              this.$message({
                message: '该商品已成功上架',
                type: 'success'
              })
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch((e) => {
          console.log(e)
        })
      },
      offSale(row) {
        this.$confirm('确认下架该商品吗?', '提示', {type: 'warning'}).then(() => {
          reqOffSaleGoods(row.id).then((res) => {
            if (res.data.msg == '成功') {
              row.productStatus = '下架'
              this.$message({
                message: '该商品已成功下架',
                type: 'success'
              })
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch((e) => {
          console.log(e)
        })
      },
      goEdit(id) {
        this.$router.push({
            name: '商品新增',
            params: {
              productId: id
            }
        })
      },
      goPreview(row) {
        console.log(row)
        this.$router.push({
            name: '商品预览',
            params: {
              product: row
            }
        })
      },
      setHighlight(val) {
      	this.currentRow = val
      },
      filterTag(value, row) {
        return row.goods_status === value
      },
      filterAuditTag(value, row) {
      	return row.auditStatus === value
      },
      setPageChange(val) {
      	this.filters.page = val - 1
      	this.getGoods()
      },
      getGoods() {
		    this.loading = true
      	reqGoodsList(this.filters).then((res) => {
          let re = res.data.data
          if (re) {
        		this.totalGoods = res.data.data.totalElements
        		this.goods = res.data.data.content
          }
      		this.loading = false
      	}).catch((err) => {
          this.loading = false
        })

      },
      showAdd() {
      	this.$router.push('/goods/add')
      },
      formatDate(val) {
        return util.formatDate.format(new Date(val), 'yyyy-MM-dd hh:mm')
      }
    },
    mounted() {
      this.getGoods();
    }
  }
</script>
