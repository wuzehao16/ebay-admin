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
        <el-button @click="syncMenu" :loading="syncLoading">同步微信</el-button>
        <el-button @click="showAddDialog">新增</el-button>
    </el-col>
    <el-col :span="24" class="warp-main">
    <div v-show="showflag" class="label-menu">一级菜单：</div>
    <div v-show="!showflag" class="label-menu">二级菜单：<span style="color:#20a0ff;">{{ label_menu }}</span>的子菜单 <el-button @click="showFather">返回一级菜单</el-button></div>
    <el-table ref="singleTable" :data="menus" v-loading='loading' highlight-current-row style="width: 100%">
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
            	<el-button size="small" @click="deleteSubmit(scope.row,scope.$index)">删除</el-button>
        	</template>
    	</el-table-column>
  	</el-table>
	
      <!--新增界面-->
      <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px"  ref="addForm">

			<el-form-item label="菜单名称">
	    		<el-input v-model="addForm.menu_name" placeholder="菜单名称"></el-input>
			</el-form-item>
			<el-form-item label="菜单类型">
			  <el-radio-group v-model="addForm.menu_type">
			    <el-radio :label="0">点击事件</el-radio>
			    <el-radio :label="1">URL地址</el-radio>
			  </el-radio-group>						
			</el-form-item>
			<el-form-item label="KEY" v-show="addForm.menu_type == 0">
	    		<el-input v-model="addForm.menu_key" placeholder="KEY"></el-input>
			</el-form-item>
			<el-form-item label="链接地址" v-show="addForm.menu_type == 1">
	    		<el-input v-model="addForm.menu_url" placeholder="链接地址"></el-input>
			</el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>  	

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
  import { reqGetWechatMenus, reqEditWechatMenu, reqDeleteWechatMenu,reqAddWechatMenu, reqSyncWechatMenu } from '../../api/api';

  export default{
    data(){
      return {
      	syncLoading: false,
      	label_menu: "",
        loading: false,
        menus: [],
        showflag: true,
       	father_menu_id: "",

        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addForm: {
          menu_name: '',
          menu_type: 0,
          menu_key: '',
          menu_url: ''
        }       	
            
      }
    },
    methods: {
      syncMenu() {
      	this.syncLoading = true
      	reqSyncWechatMenu().then((res) => {
            this.$message({
              message: '已同步微信菜单',
              type: 'success'
            })
            this.syncLoading = false
      	})
      },
      getMenuList() {
	    this.loading = true
		reqGetWechatMenus().then((res) => {
			this.menus = res.data.menus
      		this.loading = false
		})
      },
      editSubmit(row) {
      	row = Object.assign(row,{father_menu_id: this.father_menu_id})
    	reqEditWechatMenu(row).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
    	})      	
      },
      deleteSubmit(row,index) {
      	row = Object.assign(row,{father_menu_id: this.father_menu_id,index: index})
    	reqDeleteWechatMenu(row).then((res) => {
    		this.menus.splice(index,1)
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
      	this.father_menu_id = row.menu_id
      },
      showFather() {
      	this.getMenuList()
      	this.showflag = true
      	this.father_menu_id = ""
      },
      showAddDialog() {
        this.addFormVisible = true
        this.addForm = {
          menu_name: '',
          menu_type: 0,
          menu_key: '',
          menu_url: ''
        }
      },
      addSubmit() {
      	this.addLoading = true
      	Object.assign(this.addForm, {father_menu_id: this.father_menu_id})
      	reqAddWechatMenu(this.addForm).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.addLoading = false
            this.addFormVisible = false
            this.showFather()
    	}) 
      }
    },
    mounted() {
      this.getMenuList()
    }
  }
</script>

