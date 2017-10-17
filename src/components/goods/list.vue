<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>已译商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
	  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
	    <el-form :inline="true" :model="filterGoods">
	      <el-form-item>
	        <el-input v-model="filterGoods.item_id" placeholder="ItemId"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterGoods.goods_name" placeholder="商品名称"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterGoods.translator" placeholder="译者姓名"></el-input>
	      </el-form-item>
		  <el-select v-model="filterGoods.goods_status" placeholder="商品状态" clearable>
    		<el-option key="0" label="草稿" value="0"></el-option>
    		<el-option key="1" label="待上架" value="1"></el-option>
    		<el-option key="2" label="已上架" value="2"></el-option>
    		<el-option key="3" label="已下架" value="3"></el-option>
		  </el-select>
	      <el-form-item>
	        <el-button type="primary" @click="getGoods">查询</el-button>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="showAdd">新增</el-button>
	      </el-form-item>
	    </el-form>
	  </el-col>
    <el-table ref="singleTable" :data="goods" v-loading='loading' highlight-current-row @current-change="setHighlight" style="width: 100%">
    	<el-table-column type="index" width="100"> </el-table-column>
    	<el-table-column property="id" label="商品编号" width='200'></el-table-column>
    	<el-table-column property="item_id" label="ItemId" width='200'></el-table-column>
    	<el-table-column property="goods_name" label="商品名称" width='200'></el-table-column>
    	<el-table-column prop="goods_status" label="商品状态" width="120" :filters="[{ text: '草稿', value: 0 }, { text: '待上架', value: 1 }, { text: '已上架', value: 2 }, { text: '已下架', value: 3 }]" :filter-method="filterTag" filter-placement="bottom-end">
        	<template scope="scope">
        		<template v-if='scope.row.goods_status == 0'>
        			<el-tag type='gray'>草稿</el-tag>
        		</template>
        		<template v-else-if='scope.row.goods_status == 1'>
        			<el-tag type='primary'>待上架</el-tag>
        		</template>
        		<template v-else-if='scope.row.goods_status == 2'>
        			<el-tag type='success'>已上架</el-tag>
        		</template>
        		<template v-else-if='scope.row.goods_status == 3'>
        			<el-tag type='warning'>已下架</el-tag>
        		</template>
        	</template>
    	</el-table-column>
    	<el-table-column property="translator" label="译者姓名"></el-table-column>
    	<el-table-column prop="audit_status" label="审核状态" width="120" :filters="[{ text: '待提审', value: 0 }, { text: '待审核', value: 1 }, { text: '已通过', value: 2 }, { text: '已驳回', value: 3 }]" :filter-method="filterAuditTag" filter-placement="bottom-end">
        	<template scope="scope">
        		<template v-if='scope.row.audit_status == 0'>
        			<el-tag type='gray'>待提审</el-tag>
        		</template>
        		<template v-else-if='scope.row.audit_status == 1'>
        			<el-tag type='primary'>待审核</el-tag>
        		</template>
        		<template v-else-if='scope.row.audit_status == 2'>
        			<el-tag type='success'>已通过</el-tag>
        		</template>
        		<template v-else-if='scope.row.audit_status == 3'>
        			<el-tag type='warning'>已驳回</el-tag>
        		</template>
        	</template>
    	</el-table-column>
    	<el-table-column property="translate_time" label="翻译时间" width="110"></el-table-column>
    	<el-table-column property="audit_time" label="审核时间" width="110"></el-table-column>
	    <el-table-column label="操作" width='160' fixed="right">
        	<template scope="scope">
            	<el-button size="small" @click="">编辑</el-button>
            	<el-button size="small" type="primary" @click="">预览</el-button>
        	</template>
    	</el-table-column>
  	</el-table>
  	<!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="setPageChange" :page-size="page_size" :total="totalGoods" style="float:right;">
        </el-pagination>
    </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import { reqGoodsList } from '../../api/api';

  export default{
    data(){
      return {
        filterGoods: {
        	item_id: '',
        	goods_name: '',
        	translator: '',
        	goods_status: ''
        },
        goods: [],
        totalGoods: 0,
        page: 1,
        page_size: 10,
        loading: false,
      }
    },
    methods: {
      setHighlight(val) {
      	this.currentRow = val
      },
      filterTag(value, row) {
        return row.goods_status === value
      },
      filterAuditTag(value, row) {
      	return row.audit_status === value
      },
      setPageChange(val) {
      	this.page = val
      	this.getGoods()
      },
      getGoods() {
		let params = {
  		  page: this.page,
  		  page_size: this.page_size
          };
      	Object.assign(params, this.filterGoods)
		    this.loading = true
      	reqGoodsList(params).then((res) => {
      		this.totalGoods = res.data.total
      		this.goods = res.data.goods
      		this.loading =false
      	})

      },
      showAdd() {
      	this.$router.push('/goods/add')
      }
    },
    mounted() {
      this.getGoods();
    }
  }
</script>
