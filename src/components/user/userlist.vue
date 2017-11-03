<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

	  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
	    <el-form :inline="true" :model="filterUsers">
	      <el-form-item>
	        <el-input v-model="filterUsers.name" placeholder="会员姓名"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterUsers.tel" placeholder="手机号码"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterUsers.wechat_id" placeholder="微信账号"></el-input>
	      </el-form-item>
		  <el-select v-model="filterUsers.usertype" placeholder="会员类型" clearable>
    		<el-option key="0" label="分销商" value="0"></el-option>
    		<el-option key="1" label="普通用户" value="1"></el-option>
		  </el-select>
	      <el-form-item>
	        <el-button type="primary" @click="getUsers">查询</el-button>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="primary" @click="showAddUserDialog">新增</el-button>
	      </el-form-item>
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="users" v-loading='userLoading' highlight-current-row @current-change="setHighlight" style="width: 100%">
    	<el-table-column type="index" width="100"> </el-table-column>
    	<el-table-column property="id" label="会员编号" width='200'></el-table-column>
    	<el-table-column property="name" label="会员姓名"></el-table-column>
    	<el-table-column property="tel" label="手机号码" width='130'></el-table-column>
    	<el-table-column  label="性别">
    		<template scope="scope">
    			{{ scope.row.sex == '0' ? '女':'男' }}
    		</template>
    	</el-table-column>
    	<el-table-column prop="usertype" label="会员类型" width="120" :filters="[{ text: '分销商', value: 0 }, { text: '普通用户', value: 1 }]" :filter-method="filterTag" filter-placement="bottom-end">
        	<template scope="scope">
            	<el-tag :type="scope.row.usertype == 0 ? 'primary' : 'success'" close-transition>{{scope.row.usertype == 0 ? '分销商':'普通用户'}}</el-tag>
        	</template>
    	</el-table-column>
    	<el-table-column property="wechat_id" label="微信号"></el-table-column>
    	<el-table-column property="register_time" label="日期"></el-table-column>
	    <el-table-column label="操作" width='160'>
        	<template scope="scope">
            	<el-button size="small" @click="showEditUserDialog(scope.$index,scope.row)">编辑</el-button>
            	<el-button size="small" type="danger" @click="delUser(scope.$index,scope.row)">删除</el-button>
        	</template>
    	</el-table-column>
  	</el-table>
  	<!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="setPageChange" :page-size="page_size" :total="totalUsers" style="float:right;">
        </el-pagination>
    </el-col>


      <!--新增用户界面-->
      <el-dialog title="新增用户" v-model="addUserFormVisible" :close-on-click-modal="false">
        <el-form :model="addUserForm" label-width="80px" :rules="addUserRules" ref="addUserForm">
          <el-form-item label="会员姓名" prop="name">
            <el-input v-model="addUserForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="tel">
            <el-input v-model="addUserForm.tel" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
			  <el-select v-model="addUserForm.sex">
	    		<el-option key="0" label="女" value="0"></el-option>
	    		<el-option key="1" label="男" value="1"></el-option>
			  </el-select>
          </el-form-item>
          <el-form-item label="会员类型" prop="usertype">
			  <el-select v-model="addUserForm.usertype" placeholder="会员类型" clearable>
	    		<el-option key="0" label="分销商" value="0"></el-option>
	    		<el-option key="1" label="普通用户" value="1"></el-option>
			  </el-select>
          </el-form-item>
          <el-form-item label="微信号" prop="tel">
            <el-input v-model="addUserForm.wechat_id" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cancelAddUser('addUserForm')">取消</el-button>
          <el-button type="primary" @click.native="addUserSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!--编辑用户界面-->
      <el-dialog title="编辑用户" v-model="editUserFormVisible" :close-on-click-modal="false">
        <el-form :model="editUserForm" label-width="80px" :rules="addUserRules" ref="editUserForm">
          <el-form-item label="会员编号" prop="id">
            <el-input v-model="editUserForm.id" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="会员姓名" prop="name">
            <el-input v-model="editUserForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="tel">
            <el-input v-model="editUserForm.tel" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
			  <el-select v-model="editUserForm.sex">
	    		<el-option key="0" label="女" value="0"></el-option>
	    		<el-option key="1" label="男" value="1"></el-option>
			  </el-select>
          </el-form-item>
          <el-form-item label="会员类型" prop="usertype">
			  <el-select v-model="editUserForm.usertype" placeholder="会员类型" clearable>
	    		<el-option key="0" label="分销商" value="0"></el-option>
	    		<el-option key="1" label="普通用户" value="1"></el-option>
			  </el-select>
          </el-form-item>
          <el-form-item label="微信号" prop="tel">
            <el-input v-model="editUserForm.wechat_id" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cancelAddUser('editUserForm')">取消</el-button>
          <el-button type="primary" @click.native="editUserSubmit">提交</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
  import util from '../../common/util'
  import {reqGetUserList2, reqDeleteUser, reqAddUser, reqEditUser } from '../../api/api';
  import {reqUserList} from '../../api'
  export default{
    data(){
      return {
        filterUsers: {
        	name: '',
        	tel: '',
        	wechat_id: '',
        	usertype: ''
        },
        users: [],
        totalUsers: 0,
        userPage: 1,
        page_size: 15,
        userLoading: false,

        //编辑相关数据
        editUserFormVisible: false,
        editUserForm: {
        	id: '',
        	name: '',
        	sex: '',
        	tel: '',
        	usertype: '',
        	wechat_id: ''
        },
        //新增用户相关数据
        addUserFormVisible: false,
        addUserForm: {
        	name: '',
        	tel: '',
        	sex: '',
        	usertype: '',
        	wechat_id: ''
        },
        addUserRules: {
        	name: [
	            {required: true, message: '请输入会员姓名', trigger: 'blur'}
	        ],
        	tel: [
	            {required: true, message: '请输入会员手机号码', trigger: 'blur'}
	        ],
        	sex: [
	            {required: true, message: '请选择性别', trigger: 'change'}
	        ],
        	usertype: [
	            {required: true, message: '请输入会员类型', trigger: 'blur'}
	        ],
        	wechat_id: [
	            {required: true, message: '请输入会员微信号', trigger: 'blur'}
	        ],
        }
      }
    },
    methods: {
      setHighlight(val) {
      	this.currentRow = val
      },
      filterTag(value, row) {
        return row.usertype === value;
      },
      setPageChange(val) {
      	this.userPage = val
      	this.getUsers()
      },
      //获取用户列表
      getUsers() {
    		let para = {
    		  page: this.userPage,
    		  page_size: this.page_size,
          name: this.filterUsers.name,
          tel: this.filterUsers.tel,
          wechat_id: this.filterUsers.wechat_id,
          usertype: this.filterUsers.usertype
        };
        this.userLoading = true
      	reqGetUserList2(para).then((res) => {
      		this.totalUsers = res.data.total
      		this.users = res.data.users
      		this.userLoading =false
      	})
      },
      //删除用户
      delUser: function (index, row) {
        this.$confirm('确认删除该用户吗?', '提示', {type: 'warning'}).then(() => {
          let para = {id: row.id};
          console.log(row)
          reqDeleteUser(para).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getUsers();
          });
        }).catch((e) => {
        	console.log(e)
        });
      },
      showEditUserDialog: function (index, row) {
      	console.log(row)
      	this.editUserFormVisible = true
      	this.editUserForm = Object.assign({}, row)

      	this.editUserForm.sex = this.editUserForm.sex.toString()
      	this.editUserForm.usertype = this.editUserForm.usertype.toString()
      },
      //编辑用户信息后提交
      editUserSubmit: function() {
      	this.$refs.editUserForm.validate( (valid) => {
      		if (valid) {
      			this.$confirm('确认提交吗？', '提示', {}).then(() => {
              		  let para = Object.assign({}, this.editUserForm);
		              reqEditUser(para).then((res) => {
		                this.$message({
		                  message: '提交成功',
		                  type: 'success'
		                });
		                this.$refs['editUserForm'].resetFields();
		                this.editUserFormVisible = false;
		                this.getUsers();
		              });
      			})
      		}
      	})
      },
      showAddUserDialog: function() {
      	this.addUserFormVisible = true
      	this.addUserForm = {
        	name: '',
        	tel: '',
        	sex: '',
        	usertype: '',
        	wechat_id: ''
      	}
      },
      cancelAddUser: function(formName) {
      	this.addUserFormVisible = false
      	this.editUserFormVisible = false
      	this.$refs[formName].resetFields()
      },
      //新增用户提交
      addUserSubmit: function() {
      	this.$refs.addUserForm.validate((valid) => {
      		if (valid) {
      			let params = Object.assign({}, this.addUserForm)
      			console.log(params)
      			reqAddUser(params).then((res) => {
      				this.$message({
      					message: '提交成功',
      					type: 'success'
      				})
      				this.cancelAddUser('addUserForm')
      				this.getUsers()
      			})
      		}else{
      			console.log("kdjfoiuojl")
      			return false
      		}
      	})
      },
    },
    mounted() {
      this.getUsers()


      reqUserList().then((res) => {

      }).
        catch((err) => {
          console.log(err)
        })
    }
  }
</script>

<style>
/*  .demo-table-expand label {
    font-weight: bold;
  }*/
</style>
