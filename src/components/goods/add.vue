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
		  <el-form-item>
		    <el-button type="primary" @click="onSearch">提取</el-button>
		  </el-form-item>
		</el-form>





		<template v-if="selected_ebay">
		  <el-form ref="addForm" :model="addForm"  label-width="100px" >
			  <el-form-item label="商品名称：">
				<label>YSL YSL MARRY ME MARRY ME</label>
			    <el-input type="textarea" v-model="addForm.productNane" placeholder="请翻译商品名称"></el-input>
			  </el-form-item>
			  <el-form-item label="商品价格：">
				<label>Price：$4432.23</label>
			    <el-input type="textarea" v-model="addForm.productPrice" placeholder="人民币价格￥"></el-input>
			  </el-form-item>
		
			  <el-form-item label="商品图片：">
				  <el-carousel :interval="41000" type="card" height="200px">
				    <el-carousel-item v-for="(item, index) in addForm.productPic.split('@')" :key="item">
				      <li :style="{background:'url(' + item + ') center no-repeat'}" style="height:100%;list-style-type:none;background-size:contain;" >
				      	<i class="el-icon-close" style="position:absolute;" @click="delPic(index)"></i>
				      </li>
				    </el-carousel-item>
				  </el-carousel>
			  </el-form-item>

			  <h2>其它参数：</h2>
			  <template v-for="item in items">
				  <el-form-item :label="'参数' + item + '名称：' ">
					<label>{{ item }}xlujljdlsj:</label>	
				    <el-input type="textarea" v-model="else_key[item]" :placeholder="'请翻译参数' + item + '名称' "></el-input>
				  </el-form-item> 
				  <el-form-item :label="'参数' + item + '内容：' ">
					<label>{{ item }}lukjludjj kljafdoul jljl </label>	
				    <el-input type="textarea" v-model="else_value[item]" :placeholder="'请翻译参数' + item + '内容' "></el-input>
				  </el-form-item>
			  </template>
		    <el-button type="primary" @click="onSave">提审</el-button>

		  </el-form>
		</template>



    </el-col>


<!-- 列表选择ID -->
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


<script>
import { reqSaveGoods } from '../../api/api'

export default {
	data() {
		return {
			items: 3,
			else_key: [],
			else_value: [],

			searchForm: {
				item_id: ''
			},
			ebay_goods: [],
			dialogTableVisible: false,
	        selected_ebay: false,
	        addForm: {//后台新增不需要openid
	        	productNane: '',
	        	productPrice: '',
	        	items: [],
	        	auditStatus: '0',
	        	productPic: 'http://i5.hunantv.com/p1/20111122/1107306679.jpg@https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=275060115,3572286152&fm=27&gp=0.jpg@https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=638139655,3405095075&fm=27&gp=0.jpg',//多个图片以@连接
	        	productIcon: 'http://i5.hunantv.com/p1/20111122/1107306679.jpg'
	        },
	        addForm_bak: null
		}
	},
	methods: {
		onSave() {
	        const loading = this.$loading({
	          lock: true,
	          text: 'Loading',
	          spinner: 'el-icon-loading',
	          background: 'rgba(0, 0, 0, 0.7)'
	        })
			for (let i in this.else_key) {
				console.log(this.else_key[i], this.else_value[i])
				this.addForm.items.push({
					attrName: this.else_key[i],
					attrValue: this.else_value[i]
				})
			}
			this.addForm.productPrice = Number.parseFloat(this.addForm.productPrice)
			console.log(this.addForm)
			reqSaveGoods(this.addForm).then((res) => {
				console.log('kdjfdkj')
				if (res.data.msg == '成功') {
					loading.close()
					this.$message({
						type: 'success',
						message: '提审成功，系统为您跳转回列表页'
					})
					this.$router.push('/goods/list')
				}
			})
		},
		onSearch() {
			this.selected_ebay = true
/*			this.selected_ebay = null
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
			})*/
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
