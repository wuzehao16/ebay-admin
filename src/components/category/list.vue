<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        <el-breadcrumb-item>分类列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" style="margin-top:20px;">
      <el-button type="success" @click="showAddDialog">新增</el-button>
    </el-col>
    <el-col :span="24" class="warp-main">
      <div v-show="showflag" class="label-menu">一级分类：</div>
      <div v-show="!showflag" class="label-menu">二级分类：<span style="color:#20a0ff;">{{ label_menu }}</span>的子类
        <el-button @click="showFather">返回一级分类</el-button>
      </div>
      <el-table ref="singleTable" :data="menus" v-loading='loading' style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="right" inline class="demo-table-expand">
              <el-form-item label="商品分类名称">
                <el-input v-model="props.row.name" placeholder="商品分类名称"></el-input>
              </el-form-item>
              <el-form-item label="排序号">
                <el-input v-model="props.row.queue" placeholder="排序号"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="editSubmit(props.row)">保存</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column property="name" label="商品分类名称" width='200'></el-table-column>
        <el-table-column property="queue" label="排序"></el-table-column>
        <el-table-column label="创建时间" width='200'>
          <template slot-scope="scope">
            {{fTimestamp(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column  label="操作" width='200'>
          <template slot-scope="scope">
            <el-button size="small" type="primary" v-show="showflag" @click="showChildren(scope.row)">二级分类</el-button>
            <el-button size="small" type="danger" @click="deleteSubmit(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--新增界面-->
      <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" ref="addForm">
          <el-form-item label="菜单名称" prop="wxMenuName" :rules="[
                      { required: true, message: '菜单名称不能为空'},
                    ]">
            <el-input v-model="addForm.wxMenuName" placeholder="菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="菜单排序" prop="wxMenuSeriNo" :rules="[
                      { required: true, message: '排序号不能为空'},
                      { type: 'number', message: '排序号必须为数字值'}
                    ]">
            <el-input v-model.number="addForm.wxMenuSeriNo" placeholder="排序号"></el-input>
          </el-form-item>
          <el-form-item label="是否有效">
            <el-radio-group v-model="addForm.wxMenuFlag">
              <el-radio :label="2">无效</el-radio>
              <el-radio :label="1">有效</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜单类型">
            <el-radio-group v-model="addForm.wxMenuType">
              <el-radio :label="1">点击事件</el-radio>
              <el-radio :label="2">URL地址</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="KEY" v-show="addForm.wxMenuType == 1">
            <el-input v-model="addForm.wxMenuContent" placeholder="KEY"></el-input>
          </el-form-item>
          <el-form-item label="链接地址" v-show="addForm.wxMenuType == 2">
            <el-input v-model="addForm.wxMenuContent" placeholder="链接地址"></el-input>
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
  width: 100px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 20px;
  width: 50%;
}

.label-menu {
  margin-bottom: 20px;
  font-weight: bold;
}

.label-menu span {}

</style>
<script>
import {
  reqCategoryList,


  reqGetWechatMenus,
  reqEditWechatMenu,
  reqDeleteWechatMenu,
  reqAddWechatMenu,
  reqSyncWechatMenu
} from "../../api/index";

export default {
  data() {
    return {
      syncLoading: false,
      label_menu: "",
      loading: false,
      menus: [],
      showflag: true,
      wxMenuParent: "",

      //新增相关数据
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addForm: {
        wxMenuName: "",
        wxMenuType: "2",
        wxMenuContent: "",
        wxMenuSeriNo: '',
        wxMenuFlag: 0
      }
    };
  },
  methods: {
    dateFormat: function(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      let t = new Date(date);
      return t.toLocaleDateString();
    },
    syncMenu() {
      this.syncLoading = true;
      reqSyncWechatMenu().then(res => {
        this.$message({
          message: "已同步微信菜单",
          type: "success"
        });
        this.syncLoading = false;
      });
    },
    getMenuList(id) {
      this.loading = true;
      let params = { id: id }
/*      reqGetWechatMenus(params).then(res => {
        this.menus = res.data.data;
        this.loading = false;
      });*/


      reqCategoryList({
        pid: '0'
      }).then(res => {
        this.menus = res.data.data
        this.loading = false
      }).catch(err => {})
    },
    editSubmit(row) {
      row = Object.assign(row, { wxMenuParent: this.wxMenuParent });
      reqEditWechatMenu(row).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.getMenuList();
      });
    },
    deleteSubmit(row, index) {
      row = Object.assign(row, {
        wxMenuParent: this.wxMenuParent,
        index: index
      });
      reqDeleteWechatMenu(row).then(res => {
        this.menus.splice(index, 1);
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
    },
    showChildren(row) {
      this.label_menu = row.wxMenuName;
      this.menus = row.children;
      this.showflag = false;
      this.wxMenuParent = row.id;

      this.getMenuList(row.id);
    },
    showFather() {
      this.getMenuList();
      this.showflag = true;
      this.wxMenuParent = "";
    },
    showAddDialog() {
      this.addFormVisible = true;
      this.addForm = {
        wxMenuName: "",
        wxMenuType: 0,
        wxMenuContent: "",
        wxMenuSeriNo: '',
        wxMenuFlag: 0
      };
    },
    addSubmit() {
      this.addLoading = true;
      Object.assign(this.addForm, { wxMenuParent: this.wxMenuParent });
      reqAddWechatMenu(this.addForm).then(res => {
        this.addFormVisible = false
        this.addLoading = false
        if (res.data.code == 0) {
          this.$message({
            message: "新增成功",
            type: "success"
          })
          this.getMenuList(this.wxMenuParent)
        } else {
          this.$message({
            message: res.data.msg,
            type: "success"
          })
        }

      });
    }
  },
  mounted() {
    this.getMenuList();
  }
};

</script>
