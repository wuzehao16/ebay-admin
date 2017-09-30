<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>微信管理</el-breadcrumb-item>
        <el-breadcrumb-item>自定义菜单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" style="margin-top:20px;">
        <el-button>同步微信</el-button>
        <el-button>删除</el-button>
    </el-col>
    <el-col :span="24" class="warp-main">
    <div v-show="showflag" class="label-menu">一级菜单：</div>
    <div v-show="!showflag" class="label-menu">二级菜单：<span style="color:#20a0ff;">{{ label_menu }}</span>的子菜单</div>
    <el-table ref="singleTable" :data="menus" v-loading='loading' highlight-current-row @current-change="setHighlight"  style="width: 100%">
    	<el-table-column type="expand">
    		<template scope="props">
    			<el-form label-position="right" inline class="demo-table-expand">
    				<el-form-item label="菜单名称">
                		<el-input v-model="props.row.menu_name" placeholder="菜单名称"></el-input>
    				</el-form-item>
    				<el-form-item label="菜单类型">
						  <el-radio-group v-model="props.row.menu_type">
						    <el-radio :label="0">点击事件</el-radio>
						    <el-radio :label="1">URL地址</el-radio>
						  </el-radio-group>						
    				</el-form-item>
    				<el-form-item label="KEY" v-show="props.row.menu_type == 0">
                		<el-input v-model="props.row.menu_key" placeholder="KEY"></el-input>
    				</el-form-item>
    				<el-form-item label="链接地址" v-show="props.row.menu_type == 1">
                		<el-input v-model="props.row.menu_url" placeholder="链接地址"></el-input>
    				</el-form-item>
    				<el-form-item>
        				<el-button @click="editSubmit(props.row)">保存</el-button>
    				</el-form-item>
    			</el-form>
    		</template>
    	</el-table-column>
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="menu_id" label="编号" width='200'></el-table-column>
    	<el-table-column property="menu_name" label="菜单名称"></el-table-column>
    	<el-table-column property="create_time" label="创建时间" width='200'></el-table-column>
    	<el-table-column property="update_time" label="更新时间" width='200'></el-table-column>
    
	    <el-table-column fixed="right" label="操作" width='220'>
        	<template scope="scope">
            	<el-button size="small" type="primary" v-show="showflag" @click="showChildren(scope.row)">二级菜单</el-button>
            	<el-button size="small" @click="showDetail(scope.row)">删除</el-button>
        	</template>
    	</el-table-column>
  	</el-table>

    </el-col>
  </el-row>
</template>


<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 20px;
    width: 50%;
  }
  .label-menu{
    margin-bottom: 20px;
    font-weight: bold;  	
  }
  .label-menu span{

  }
</style>


<script>
  import {  reqReconciliationList, reqGetWechatMenus, reqEditWechatMenu } from '../../api/api';

  export default{
    data(){
      return {
      	label_menu: "",
        filter: {
        	trade_id: '',
        	user_name: '',
        	reconc_status: '',
        	platform_time: '',
        	ebay_time: ''
        },
        page_size: 20,
        loading: false,
        orderPage: 1,
        total: 0,
        menus: [],
        showflag: true
       
            
      }
    },
    methods: {
      setHighlight(val) {
      	this.currentRow = val
      },
      setPageChange(val) {
      	this.orderPage = val
      	this.getReconList()
      },
      getReconList() {
      	let pa = {
      		page: this.orderPage,
      		page_size: this.page_size
      	}
      	Object.assign(pa, this.filter)
 /*	    this.loading = true
		reqReconciliationList(pa).then((res) => {
			this.total = res.data.total
			this.menus = res.data.menus
      		this.loading = false
		})*/

		reqGetWechatMenus().then((res) => {
			this.menus = res.data.menus
			console.log(this.menus[0])

		})
      },
      showEdit(row) {
      	this.$router.push({
      		name: '对账处理',
      		params: {
      			reconciliation: row
      		}
      	})
      },
      editSubmit(row) {
      	console.log(row)
    	reqEditWechatMenu(row).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
    	})      	
      },
      showChildren(row) {
      	this.label_menu = row.menu_name
      	this.menus = row.children
      	this.showflag = false
      }
    },
    mounted() {
      this.getReconList();


    }
  }
</script>

