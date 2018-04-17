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
      <el-button type="success" @click="showAddDialog('-1')">新增</el-button>
    </el-col>
    <el-col :span="24" class="warp-main">
      <div v-show="showflag" class="label-menu">一级分类：</div>
      <div v-show="!showflag" class="label-menu">二级分类：<span style="color:#20a0ff;">{{ label_menu }}</span>的子类
        <el-button @click="showFather">返回一级分类</el-button>
      </div>
      <el-table ref="singleTable" :data="menus" v-loading='loading' style="width: 100%">
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column property="name" label="商品分类名称" width='200'></el-table-column>
        <el-table-column property="queue" label="排序"></el-table-column>
        <el-table-column label="创建时间" width='200'>
          <template slot-scope="scope">
            {{fTimestamp(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width='200'>
          <template slot-scope="scope">
            <el-button size="small" type="primary" v-show="showflag" @click="showChildren(scope.row)">二级分类</el-button>
            <el-button size="small" type="danger" @click="showAddDialog(scope.row,scope.$index)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--新增界面-->
      <el-dialog :title="dialogTitle" v-model="addFormVisible" :close-on-click-modal="false" :before-close='beforeClose'>
        <el-form :model="addForm" label-width="80px" ref="addForm">
          <el-form-item label="分类名称" prop="name" :rules="[
                      { required: true, message: '分类名称不能为空'},
                    ]">
            <el-input v-model="addForm.name" placeholder="分类名称"></el-input>
          </el-form-item>
          <el-form-item label="菜单排序" prop="queue" :rules="[
                      { required: true, message: '排序号不能为空'}
                    ]">
            <el-input v-model="addForm.queue" placeholder="排序号"></el-input>
          </el-form-item>
          <el-form-item label="分类级别" prop="leve" :rules="[
                      { required: true, message: '请选择分类级别'}
                    ]">
            <el-radio-group v-model="addForm.leve" :disabled='isEdit'>
              <el-radio label="2">二级</el-radio>
              <el-radio label="1">一级</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="所属分类" v-if="addForm.leve == 2" prop="pid" :rules="[
                      { required: true, message: '请选择所属分类'}
                    ]">
            <el-select v-model="addForm.pid" placeholder="请选择">
              <el-option v-for="item in firCategory" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品类图片">
            <div class="wrap-pic wrap-pic-1" id="pic_wrap_one">
              <p>请选择图片</p>
              <img :src="imageUrl[0]">
              <input type="file" name="pic" id="pic" accept="image/jpg" @change="changePic('pic', 0)" />
            </div>
            <el-progress v-if='showProgress[0]' :percentage="uploadPercent[0]" :status="uploadStatus[0]"></el-progress>
            <el-button @click.native="uploadBanner('pic', 0)" :disabled="updisabled[0]">上传</el-button>
          </el-form-item>
          <el-form-item label="大图片">
            <div class="wrap-pic" id="pic_wrap">
              <p>请选择图片</p>
              <img :src="imageUrl[1]">
              <input type="file" name="pic_2" id="pic_2" accept="image/jpg" @change="changePic('pic_2', 1)" />
            </div>
            <el-progress v-if='showProgress[1]' :percentage="uploadPercent[1]" :status="uploadStatus[1]"></el-progress>
            <el-button @click.native="uploadBanner('pic_2', 1)" :disabled="updisabled[1]">上传</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="closeDialog">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import {
  reqCategoryList,
  reqCategorySave,
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
        name: '',
        queue: '',
        leve: ''
      },
      addForm_bak: {},
      firCategory: [],

      uploadPercent: [0, 0],
      uploadStatus: ['', ''],
      showProgress: [false, false],
      imageUrl: ['', ''],
      updisabled: [true, ''],
      isNewOrChanged: [false, false],
      isEdit: false
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑' : '新增'
    }
  },
  methods: {
    beforeClose() {
      this.closeDialog()
    },
    closeDialog() {
      this.$refs['addForm'].resetFields()
      this.addFormVisible = false
    },
    changePic(id, n) {
      let _this = this
      this.isNewOrChanged.splice(n, 1, true)
      console.log('changePic in method.')

      this.showProgress.splice(n, 1, false)
      this.uploadStatus.splice(n, 1, '')
      this.updisabled.splice(n, 1, false)

      //获取文件  
      let file = document.getElementById(id).files[0];
      if (!file) {
        _this.imageUrl.splice(n, 1, '')
        return
      }
      //创建读取文件的对象  
      let reader = new FileReader();
      //为文件读取成功设置事件  
      reader.onload = function(e) {
        // alert('文件读取完成')
        console.log(this)
        _this.imageUrl.splice(n, 1, e.target.result)
      }
      //正式读取文件  
      reader.readAsDataURL(file)
    },
    uploadBanner(id, n) {
      this.updisabled.splice(n, 1, true)
      var files = document.getElementById(id).files; //files是文件选择框选择的文件对象数组  
      if (files.length == 0) {
        this.$message({
          type: 'info',
          message: '请选择要上传的图片'
        })
        return;
      }

      this.showProgress.splice(n, 1, true)
      var form = new FormData(),
        url = 'http://www.wstsoftware.com/sell/seller/upload', //服务器上传地址  
        file = files[0];
      form.append('file', file);
      var xhr = new XMLHttpRequest();
      xhr.open("post", url, true);

      let _this = this
      //上传进度事件  
      xhr.upload.addEventListener("progress", function(result) {
        console.log('aa', result)
        if (result.lengthComputable) {
          //上传进度  
          let a = (result.loaded / result.total * 100).toFixed(0);
          _this.uploadPercent.splice(n, 1, a)
          console.log('haha', a)
        }
      }, false);

      xhr.addEventListener("readystatechange", function() {
        var result = xhr;
        if (result.status != 200) { //error  
          console.log('上传失败', result.status, result.statusText, result.response);
          _this.$message({
            type: 'error',
            message: '图片上传失败！'
          })
        } else if (result.readyState == 4) { //finished  
          console.log('上传成功', result)
          let a = JSON.parse(result.response)
          if (n == 0) {
            _this.addForm.imageUrl = a.data
          } else {
            _this.addForm.bigImageUrl = a.data
          }
          _this.isNewOrChanged.splice(n, 1, false)
          _this.uploadStatus.splice(n, 1, 'success')
        }
      });
      xhr.send(form); //开始上传  
    },
    dateFormat: function(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      let t = new Date(date);
      return t.toLocaleDateString();
    },
    getCategorys(pid) {
      this.loading = true
      reqCategoryList({
        pid: pid
      }).then(res => {
        this.menus = res.data.data
        if (pid == '0') {
          this.firCategory = res.data.data
          for (let i of this.firCategory) {
            i.id = i.id.toString()
          }
        }
        this.loading = false
      }).catch(err => {})
    },
    showChildren(row) {
      this.label_menu = row.name
      this.showflag = false
      this.wxMenuParent = row.id
      this.getCategorys(row.id);
    },
    showFather() {
      this.getCategorys('0')
      this.showflag = true
      this.wxMenuParent = ""
    },
    showAddDialog(row) {
      this.imageUrl.splice(0, 1, '')
      this.imageUrl.splice(1, 1, '')
      this.addFormVisible = true
      this.showProgress.splice(0, 1, false)
      this.showProgress.splice(1, 1, false)
      this.$nextTick(function() {
        // DOM 更新了
        let b = document.getElementById('pic_wrap').clientWidth
        document.getElementById('pic_wrap').style.height = b * 0.46 + 'px'
      })

      if (row == '-1') { //新增
        this.isEdit = false
        this.isNewOrChanged.splice(0, 1, true)
        this.isNewOrChanged.splice(1, 1, true)
        this.addForm = Object.assign({}, this.addForm_bak)
      } else { //编辑
        console.log('aaa', row)
        console.log('bbb', this.firCategory)
        this.isEdit = true
        this.imageUrl.splice(0, 1, row.imageUrl)
        this.imageUrl.splice(1, 1, row.bigImageUrl)
        this.isNewOrChanged.splice(0, 1, false)
        this.isNewOrChanged.splice(1, 1, false)
        this.addForm = Object.assign({}, row)
      }
    },
    addSubmit() {
      if (this.isNewOrChanged[0] && this.isNewOrChanged[1]) {
        this.$message({
          type: 'info',
          message: '请先点击上传按钮将图片上传'
        })
        return
      }
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.addLoading = true
          reqCategorySave(this.addForm).then(res => {
            this.addFormVisible = false
            this.addLoading = false
            if (res.data.code == 0) {
              this.$message({
                message: "新增成功",
                type: "success"
              })
              this.getCategorys(this.addForm.pid)
            } else {
              this.$message({
                message: res.data.msg,
                type: "info"
              })
            }
          })
        }
      })
    }
  },
  mounted() {
    this.getCategorys('0')
    this.addForm_bak = Object.assign({}, this.addForm)
  }
};

</script>
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

.wrap-pic-1 {
  width: 150px!important;
}

</style>
