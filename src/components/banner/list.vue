<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>轮播管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
      <el-col :span="24" class="toolbar" style="padding-bottom: 20px;">
        <el-button type="primary" @click="showEditUserDialog('-1')">新增</el-button>
      </el-col>
      <el-table ref="singleTable" :data="bannerList" v-loading='userLoading' @current-change="setHighlight" style="width: 100%">
        <el-table-column property="name" label="轮播名称" min-width="100"></el-table-column>
        <el-table-column property="clickUrl" label="跳转地址" min-width="100"></el-table-column>
        <el-table-column prop="isValid" label="是否上线" min-width="120" :filters="[{ text: '在线', value: '1' }, { text: '下线', value: '0' }]" :filter-method="filterTag" filter-placement="bottom-end">
          <template scope="scope">
            <template v-if="scope.row.isValid == '1'">
              在线
            </template>
            <template v-else-if="scope.row.isValid == '0'">
              下线
            </template>
            <template v-else>
              不明
            </template>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="160">
          <template scope="scope">
            {{ fTimestamp(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" @click="showEditUserDialog(scope.$index,scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total" :total="totalUsers" style="float:right;">
        </el-pagination>
      </el-col>
      <!--编辑用户界面-->
      <el-dialog title="编辑轮播" v-model="editUserFormVisible" :close-on-click-modal="false" max-width="800px" class="userEditForm">
        <el-form :model="editUserForm" label-width="80px" ref="editUserForm" :rules="rules">
          <el-form-item label="轮播名称" prop="name">
            <el-input v-model="editUserForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="跳转地址" prop="clickUrl">
            <el-input v-model="editUserForm.clickUrl" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <input type="file" name="pic" id="pic" accept="image/jpg" @change="changePic" />
            <el-button @click.native="uploadBanner">上传</el-button>
          </el-form-item>
          <el-form-item label="是否上线" prop="isValid">
            <el-select v-model="editUserForm.isValid" placeholder="是否上线" clearable>
              <el-option key="1" label="在线" value="1"></el-option>
              <el-option key="2" label="下线" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="queue">
            <el-input v-model="editUserForm.queue" auto-complete="off"></el-input>
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
import { reqBannerList, reqBannerSave, reqGetUserList, reqDeleteUser, reqEditUser } from "../../api";
export default {
  data() {
    return {
      isNewOrChanged: false,
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
        clickUrl: "",
        imageUrl: "",
        isValid: "",
        name: "",
        queue: ""
      },
      rules: {
        clickUrl: { required: true, message: '请输入跳转地址', trigger: 'change' },
        name: { required: true, message: '请输入轮播名称', trigger: 'change' },
        queue: { required: true,  message: '请输入排序', trigger: 'change' },
        isValid: { required: true,  message: '请选择是否在线', trigger: 'change' }
      },
      bannerForm_bak: {},

      bannerList: []
    };
  },
  methods: {
    changePic() {
      this.isNewOrChanged = true
    },
    uploadBanner() {
      var files = document.getElementById('pic').files; //files是文件选择框选择的文件对象数组  

      if (files.length == 0) {
        this.$message({
          type: 'info',
          message: '请选择要上传的图片'
        })
        return;
      }

      var form = new FormData(),
        url = 'http://www.wstsoftware.com/sell/seller/upload', //服务器上传地址  
        file = files[0];
      form.append('file', file);

      var xhr = new XMLHttpRequest();
      xhr.open("post", url, true);

      //上传进度事件  
      xhr.upload.addEventListener("progress", function(result) {
        if (result.lengthComputable) {
          //上传进度  
          var percent = (result.loaded / result.total * 100).toFixed(2);
        }
      }, false);

      xhr.addEventListener("readystatechange", function() {
        var result = xhr;
        if (result.status != 200) { //error  
          console.log('上传失败', result.status, result.statusText, result.response);
        } else if (result.readyState == 4) { //finished  
          console.log('上传成功', result);
          this.isNewOrChanged = false
        }
      });
      xhr.send(form); //开始上传  
    },
    setHighlight(val) {
      this.currentRow = val;
    },
    filterTag(value, row) {
      return row.isvalid === value;
    },
    //获取用户列表
    getUsers() {
      this.userLoading = true;

      reqBannerList({
          isvalid: 'all',
          isBack: true
        }).then(res => {
          console.log(res)
          this.bannerList = res.data.data.bannerList
          this.totalUsers = this.bannerList.length
          this.userLoading = false;
        })
        .catch(err => {
          this.$message.error(res.data.msg);
          this.userLoading = false;
        })
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

        });
    },
    showEditUserDialog: function(index, row) {
      this.editUserFormVisible = true;
      if (index == '-1') {
        this.isNewOrChanged = true
        this.editUserForm = Object.assign({}, this.bannerForm_bak)
      } else {
        this.editUserForm = Object.assign({}, row);
      }
    },
    //编辑用户信息后提交
    editUserSubmit: function() {
      this.$refs['editUserForm'].validate(valid => {
        if (valid) {
          if (this.isNewOrChanged) {
            this.$message({
              type: 'info',
              message: '请先点击上传按钮将图片上传'
            })
            return
          }
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            reqBannerSave(this.editUserForm).then(res => {
              if (res.data.msg == "成功") {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.editUserFormVisible = false;
                this.getUsers();
              }
            })
          })
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
    this.bannerForm_bak = Object.assign({}, this.editUserForm)
  }
};

</script>
<style lang="scss" scoped>
.userEditFormP {
  .el-dialog--small {
    width: 600px !important;
  }
}

</style>
