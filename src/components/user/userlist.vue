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
	        <el-input v-model="filterUsers.userName" placeholder="会员姓名"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterUsers.userPhone" placeholder="手机号码"></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-input v-model="filterUsers.userWxOpenid" placeholder="微信账号"></el-input>
	      </el-form-item>
		  <el-select v-model="filterUsers.userCtype" placeholder="会员类型" clearable>
    		<el-option key="0" label="分销商" value="1"></el-option>
    		<el-option key="1" label="普通用户" value="2"></el-option>
		  </el-select>
	      <el-form-item>
	        <el-button type="primary" @click="getUsers">查询</el-button>
	      </el-form-item>
	    </el-form>
	  </el-col>


    <el-table ref="singleTable" :data="users" v-loading='userLoading'  @current-change="setHighlight" style="width: 100%">
    	<el-table-column property="id" label="会员编号" min-width="100"></el-table-column>
    	<el-table-column property="userName" label="会员姓名" min-width="100"></el-table-column>
    	<el-table-column property="userPhone" label="手机号码" min-width='130'></el-table-column>
    	<el-table-column prop="userCtype" label="会员类型" min-width="120" :filters="[{ text: '分销商', value: '1' }, { text: '普通用户', value: '2' }]" :filter-method="filterTag" filter-placement="bottom-end">
        	<template scope="scope">
            <template v-if="scope.row.userCtype == '2'">
              <el-tag type='primary' close-transition>普通用户</el-tag>
            </template>
            <template v-else-if="scope.row.userCtype == '1'">
              <el-tag type='success' close-transition>分销商</el-tag>
            </template>
            <template v-else>
              <el-tag type='danger' close-transition>不明身份</el-tag>
            </template>
        	</template>
    	</el-table-column>
    	<el-table-column property="userWxOpenid" label="微信号"></el-table-column>
    	<el-table-column label="日期" min-width="160">
          <template scope="scope">
          {{ fTimestamp(scope.row.created) }}
          </template> 
          
      </el-table-column>
	    <el-table-column label="操作" width='240'>
        	<template scope="scope">
              <el-button size="small" @click="showEditUserDialog(scope.$index,scope.row)">编辑</el-button>
              <template v-if="scope.row.isActive == 'Y'">
              <el-button size="small" @click="changeActive(scope.row)">禁用</el-button>
              </template>
              <template v-else>
            	<el-button size="small" @click="changeActive(scope.row)">解禁</el-button>
              </template>
            	<el-button size="small" type="danger" @click="delUser(scope.$index,scope.row)">删除</el-button>
        	</template>
    	</el-table-column>
  	</el-table>
  	<!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-pagination layout="total, sizes, prev, pager, next" @current-change="setPageChange" @size-change="setSizeChange" :page-size="filterUsers.size" :total="totalUsers" style="float:right;">
        </el-pagination>
    </el-col>

      <!--编辑用户界面-->
      <el-dialog title="编辑用户" v-model="editUserFormVisible" :close-on-click-modal="false">
        <el-form :model="editUserForm" label-width="80px" ref="editUserForm">
          <el-form-item label="会员编号" prop="id">
            <el-input v-model="editUserForm.id" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="会员姓名" prop="name">
            <el-input v-model="editUserForm.userName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="tel">
            <el-input v-model="editUserForm.userPhone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="会员类型" prop="usertype">
    			  <el-select v-model="editUserForm.userCtype" 
              placeholder="会员类型" clearable>
    	    		<el-option key="1" label="分销商" value="1"></el-option>
    	    		<el-option key="2" label="普通用户" value="2"></el-option>
    			  </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cancelEditUser('editUserForm')">取消</el-button>
          <el-button type="primary" @click.native="editUserSubmit">提交</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import util from "../../common/util";
import { reqGetUserList, reqDeleteUser, reqEditUser } from "../../api";
export default {
  data() {
    return {
      filterUsers: {
        userName: "",
        userPhone: "",
        userWxOpenid: "",
        userCtype: "",
        page: 0,
        size: 10
      },
      users: [],
      totalUsers: 0,
      userLoading: false,

      //编辑相关数据
      editUserFormVisible: false,
      editUserForm: {
        id: "",
        name: "",
        sex: "",
        tel: "",
        usertype: "",
        wechat_id: ""
      }
    };
  },
  methods: {
    setHighlight(val) {
      this.currentRow = val;
    },
    filterTag(value, row) {
      return row.userCtype === value;
    },
    setSizeChange(val) {
      this.filterUsers.size = val - 1;
      this.getUsers();
    },
    setPageChange(val) {
      this.filterUsers.page = val - 1;
      this.getUsers();
    },
    //获取用户列表
    getUsers() {
      this.userLoading = true;
      reqGetUserList(this.filterUsers)
        .then(res => {
          let result = res.data.data;
          if (res.data.msg == "成功") {
            this.totalUsers = result.totalElements;
            this.users = result.content;
          }
          this.userLoading = false;
        })
        .catch(err => {
          this.$message.error(res.data.msg);
          this.userLoading = false;
        });
    },
    //删除用户
    delUser: function(index, row) {
      this.$confirm("确认删除该用户吗?", "提示", { type: "warning" })
        .then(() => {
          reqDeleteUser(row).then(res => {
            if (res.data.msg == "成功") {
              this.users.splice(index, 1);
              this.$message({
                message: "删除成功",
                type: "success"
              });
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    showEditUserDialog: function(index, row) {
      // this.$refs[formName].resetFields()
      this.editUserFormVisible = true;
      this.editUserForm = Object.assign({}, row);
    },
    //编辑用户信息后提交
    editUserSubmit: function() {
      this.$refs.editUserForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            reqEditUser(this.editUserForm).then(res => {
              console.log(res);
              if (res.data.msg == "成功") {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.editUserFormVisible = false;
                this.getUsers();
              }
            });
          });
        }
      });
    },
    changeActive(row) {
      let pa = {
        id: row.id,
        isActive: row.isActive == "Y" ? "N" : "Y"
      };
      reqEditUser(pa).then(res => {
        if (res.data.msg == "成功") {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          row.isActive == "Y" ? (row.isActive = "N") : (row.isActive = "Y");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    cancelEditUser: function(formName) {
      this.editUserFormVisible = false;
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>

<style>

</style>
