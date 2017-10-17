<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods/list' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品新增</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
		<el-form inline :model="searchForm" class="demo-form-inline">
		  <el-form-item label="Ebay原链">
		    <el-input v-model="searchForm.item_id" placeholder="ItemId"></el-input>
		  </el-form-item>
		<!--   <el-form-item label="活动区域">
		    <el-select v-model="formInline.region" placeholder="活动区域">
		      <el-option label="区域一" value="shanghai"></el-option>
		      <el-option label="区域二" value="beijing"></el-option>
		    </el-select>
		  </el-form-item> --> 
		  <el-form-item>
		    <el-button type="primary" @click="onSearch">提取</el-button>
		  </el-form-item>
		</el-form>





		<template v-if="selected_ebay">
		  <el-form ref="addForm" :model="addForm"  label-width="100px" >
		  	  <el-form-item label="数据模型：">
		  		<label>{{ selected_ebay.data_model }}</label>
		  	  </el-form-item>
			  <el-form-item label="商品名称：">
				<label>{{ selected_ebay.e_goods_name }}</label>
			    <el-input type="textarea" v-model="addForm.goods_name" placeholder="请翻译商品名称"></el-input>
			  </el-form-item>
			  <el-form-item label="商品价格：">
				<label>美元价格：${{ selected_ebay.e_usd_price }}</label>
			    <el-input type="textarea" v-model="addForm.goods_price" placeholder="人民币价格￥"></el-input>
			  </el-form-item>
			  <el-form-item label="商品特色：">
				<label>{{ selected_ebay.e_features }}</label>
			    <el-input type="textarea" v-model="addForm.goods_features" placeholder="请翻译商品特色"></el-input>
			  </el-form-item>
			  <el-form-item label="商品产地：">
				<label>{{ selected_ebay.e_origin }}</label>	
			    <el-input type="textarea" v-model="addForm.goods_origin" placeholder="请翻译商品产地"></el-input>
			  </el-form-item>
			  <el-form-item label="商品图片：">
				  <el-carousel :interval="41000" type="card" height="200px">
				    <el-carousel-item v-for="(item, index) in selected_ebay.e_pics" :key="item">
				      <li :style="{background:'url(' + item + ') center no-repeat'}" style="height:100%;list-style-type:none;background-size:contain;" >
				      	<i class="el-icon-close" style="position:absolute;" @click="delPic(index)"></i>
				      </li>
				    </el-carousel-item>
				  </el-carousel>			  
			  </el-form-item>

			  <h2>其它参数：</h2>
			  <template v-if="selected_ebay.e_des" v-for="(item, index) in selected_ebay.e_des">
				  <el-form-item :label="'参数' + (index + 1) + '名称：' ">
					<label>{{ item.key }}</label>	
				    <el-input type="textarea" v-model="addForm.goods_des[index].key" :placeholder="'请翻译参数' + (index + 1) + '名称' "></el-input>
				  </el-form-item> 
				  <el-form-item :label="'参数' + (index + 1) + '内容：' ">
					<label>{{ item.value }}</label>	
				    <el-input type="textarea" v-model="addForm.goods_des[index].value" :placeholder="'请翻译参数' + (index + 1) + '内容' "></el-input>
				  </el-form-item>

			  </template>
			  <label>{{ addForm }}</label>





		
		  </el-form>
		</template>



    </el-col>

	<el-dialog title="请选择：" :visible.sync="dialogTableVisible">
		<el-table
			ref="singleTable"
			:data="ebay_goods"
			highlight-current-row
			@current-change="handleCurrentChange"
			style="width: 100%" height='300'>
		<el-table-column
		  type="index"
		  width="60">
		</el-table-column>
		<el-table-column
		  property="item_id"
		  label="ItemId">
		</el-table-column>
		<el-table-column
		  property="e_goods_name"
		  label="商品名称">
		</el-table-column>
		</el-table>
		<div slot="footer" class="dialog-footer">
		  <el-button type="primary" @click.native="closeConfirm">确定</el-button>
		</div>
	</el-dialog>
  </el-row>	



</template>

<style>
.el-table__body tr.current-row>td {
    background: #9eb2c1!important;
}
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .el-icon-close{
  	display: none;
  }
  .is-active .el-icon-close{
  	display: block;
  }
  .el-icon-close:hover{
  	color: red;
  }
</style>

<script>
import { reqEbayGoods } from '../../api/api'

export default {
	data() {
		return {
			searchForm: {
				item_id: ''
			},
			ebay_goods: [],
			dialogTableVisible: false,
	        selected_ebay: null,
	        addForm: {
	        	goods_name: '',
	        	goods_price: '',
	        	goods_features: '',
	        	goods_origin: '',
	        	goods_des: []
	        },
	        addForm_bak: null
		}
	},
	methods: {
		onSearch() {
			this.selected_ebay = null
			reqEbayGoods(this.searchForm).then((res) => {
				let arr = res.data.ebay_goods
				if ( arr.length === 0 ){
					this.$message("没有此商品！")
				} else if ( arr.length === 1 ) {
					this.initGoodsDes(arr[0].e_des)
					this.selected_ebay = arr[0]
				} else {
					//展示列表
					this.ebay_goods = res.data.ebay_goods
					this.dialogTableVisible = true
				}
			})
		},
		handleCurrentChange(val) {
			if (val) {
				this.initGoodsDes(val.e_des)
			}
			this.selected_ebay = val
		},
		closeConfirm() {
			this.selected_ebay ? this.dialogTableVisible = false : this.$message("请选择商品！")
		},
		delPic(index) {
			this.selected_ebay.e_pics.splice(index, 1)
		},
		initGoodsDes(arr) {
			this.addForm.goods_des = []
			for ( let i = 0; i < arr.length; i++ ) {
				this.addForm.goods_des.push({
					key: '',
					value: ""
				})
			}			
		}
	}
}
</script>
