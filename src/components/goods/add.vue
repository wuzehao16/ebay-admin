<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods/list' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ crumbName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
		<el-form inline :model="searchForm" class="demo-form-inline" v-if="!isEdit">
		  <el-form-item label="Ebay原链">
		    <el-input v-model="searchForm.item_id" placeholder="ItemId"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="onSearch">提取</el-button>
		  </el-form-item>
		</el-form>

		<template v-if="selected_ebay">
		  <el-form ref="pro_info" :model="pro_info"  label-width="100px" >
			  <el-form-item label="商品名称：">
				<label>YSL YSL MARRY ME MARRY ME</label>
			    <el-input type="textarea" v-model="pro_info.productNane" placeholder="请翻译商品名称"></el-input>
			  </el-form-item>
			  <el-form-item label="商品价格：">
				<label>Price：$4432.23</label>
			    <el-input type="textarea" v-model="pro_info.productPrice" placeholder="人民币价格￥"></el-input>
			  </el-form-item>
		
			  <el-form-item label="商品图片：">
				  <el-carousel :interval="41000" type="card" height="200px">
				    <el-carousel-item v-for="(item, index) in pro_info.productPic.split('@')" :key="item">
				      <li :style="{background:'url(' + item + ') center no-repeat'}" style="height:100%;list-style-type:none;" >
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
import { reqSaveGoods, reqGoodsDetail } from '../../api/api'

export default {
	data() {
		return {
			crumbName: '商品新增',
			items: 3,
			else_key: [],
			else_value: [],
			isEdit: false,
			productId: '',

			searchForm: {
				item_id: ''
			},
			ebay_goods: [],
			dialogTableVisible: false,
	        selected_ebay: false,
	        pro_info: {//后台新增不需要openid
	        	productNane: '',
	        	productPrice: '',
	        	items: [],
	        	auditStatus: '0',
	        	productPic: 'http://i5.hunantv.com/p1/20111122/1107306679.jpg@https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=275060115,3572286152&fm=27&gp=0.jpg@https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=638139655,3405095075&fm=27&gp=0.jpg',//多个图片以@连接
	        	productIcon: 'http://i5.hunantv.com/p1/20111122/1107306679.jpg'
	        },
	        pro_info_bak: null
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
				console.log(i)
				console.log(this.else_key[i], this.else_value[i])
				if (!this.isEdit) {
					this.pro_info.items.push({
						attrName: this.else_key[i],
						attrValue: this.else_value[i]
					})					
				} else {
					let j = Number.parseInt(i) - 1
					this.pro_info.items[j].attrName = this.else_key[i]
					this.pro_info.items[j].attrValue = this.else_value[i]
				}


			}
			this.pro_info.productPrice = Number.parseFloat(this.pro_info.productPrice)
			this.isEdit ? this.pro_info.productId = this.productId : ''
			console.log(this.pro_info)

			reqSaveGoods(this.pro_info).then((res) => {
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
			this.pro_info.goods_des = []
			for ( let i = 0; i < arr.length; i++ ) {
				this.pro_info.goods_des.push({
					key: '',
					value: ""
				})
			}			
		}
	},
	mounted() {
		this.productId = this.$route.params.productId
		if (this.productId) {
			this.isEdit = true
			this.selected_ebay = true
			this.crumbName = '商品编辑'
			reqGoodsDetail({productId: this.productId}).then((res) => {
	          let p = res.data.data
	          this.items = p.productAttr.length
	          this.pro_info = {
	            auditStatus: '0',//待审核
	            productNane: p.name,
	            productPic: p.pic.join('@'),
	            productPrice: p.price,
	            productIcon: p.icon,
	            items: p.productAttr
	          }
	          for (let i in p.productAttr) {
	            let j = Number.parseInt(i) + 1
	            this.else_key[j] = p.productAttr[i].attrName
	            this.else_value[j] = p.productAttr[i].attrValue
	          }				
			})
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
  .el-carousel__item li {
  	background-size: contain!important;
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
