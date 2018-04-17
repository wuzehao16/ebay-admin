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
        <el-button type="primary" @click="showDialog('-1')">新增</el-button>
      </el-col>
      <el-table ref="singleTable" :data="bannerList" v-loading='loading' @current-change="setHighlight" style="width: 100%">
        <el-table-column property="name" label="轮播名称" min-width="100"></el-table-column>
        <el-table-column property="clickUrl" label="跳转地址" min-width="100"></el-table-column>
        <el-table-column prop="isValid" label="是否上线" min-width="120" :filters="[{ text: '在线', value: '1' }, { text: '下线', value: '0' }]" :filter-method="filterTag" filter-placement="bottom-end">
          <template slot-scope="scope">
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
          <template slot-scope="scope">
            {{ fTimestamp(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="showDialog(scope.$index,scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total" :total="listLength" style="float:right;">
        </el-pagination>
      </el-col>
      <el-dialog title="编辑轮播" v-model="editFormVisible" :close-on-click-modal="false" max-width="800px" class="userEditForm" :before-close='beforeClose'>
        <el-form :model="bannerForm" label-width="80px" ref="bannerForm" :rules="rules">
          <el-form-item label="轮播名称" prop="name">
            <el-input v-model="bannerForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="跳转地址" prop="clickUrl">
            <el-input v-model="bannerForm.clickUrl" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <div class="wrap-pic" id="pic_wrap">
              <p>请选择图片</p>
              <img :src="imageUrl">
              <input type="file" name="pic" id="pic" accept="image/jpg" @change="changePic" />
            </div>
            <el-progress v-if='showProgress' :percentage="uploadPercent" :status="uploadStatus"></el-progress>
            <el-button @click.native="uploadBanner" :disabled="updisabled">上传</el-button>
          </el-form-item>
          <el-form-item label="是否上线" prop="isValid">
            <el-select v-model="bannerForm.isValid" placeholder="是否上线" clearable>
              <el-option key="1" label="在线" value="1"></el-option>
              <el-option key="2" label="下线" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="queue">
            <el-input v-model="bannerForm.queue" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cancelEdit('bannerForm')">取消</el-button>
          <el-button type="primary" @click.native="bannerSubmit">提交</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import util from "../../common/util";
import { reqBannerList, reqBannerSave } from "../../api";
export default {
  data() {
    return {
      isNewOrChanged: false,
      listLength: 0,
      loading: false,
      editFormVisible: false,
      bannerForm: {
        clickUrl: "",
        imageUrl: "",
        isValid: "",
        name: "",
        queue: ""
      },
      rules: {
        clickUrl: { required: true, message: '请输入跳转地址', trigger: 'change' },
        name: { required: true, message: '请输入轮播名称', trigger: 'change' },
        queue: { required: true, message: '请输入排序', trigger: 'change' },
        isValid: { required: true, message: '请选择是否在线', trigger: 'change' }
      },
      bannerForm_bak: {},
      bannerList: [],
      uploadPercent: 0,
      uploadStatus: '',
      showProgress: true,
      imageUrl: '',
      updisabled: true
    };
  },
  methods: {
    changePic() {
      this.updisabled = false
      this.isNewOrChanged = true
      console.log('changePic in method.')

      this.showProgress = false
      this.uploadStatus = ''
      let _this = this
      //获取文件  
      let file = document.getElementById('pic').files[0];
      if (!file) {
        _this.imageUrl = ''
        return
      }
      //创建读取文件的对象  
      let reader = new FileReader();
      //为文件读取成功设置事件  
      reader.onload = function(e) {
        // alert('文件读取完成')
        console.log(this)
        _this.imageUrl = e.target.result
      }
      //正式读取文件  
      reader.readAsDataURL(file)
    },
    uploadBanner() {
      this.updisabled = true
      var files = document.getElementById('pic').files; //files是文件选择框选择的文件对象数组  
      if (files.length == 0) {
        this.$message({
          type: 'info',
          message: '请选择要上传的图片'
        })
        return;
      }
      
      this.showProgress = true
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
          _this.uploadPercent = (result.loaded / result.total * 100).toFixed(0);
          console.log('haha', _this.uploadPercent)
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
          console.log('上传成功', result);
          let a = JSON.parse(result.response)
          _this.bannerForm.imageUrl = a.data
          _this.isNewOrChanged = false
          _this.uploadStatus = 'success'
        }
      });
      xhr.send(form); //开始上传  
    },
    setHighlight(val) {
      this.currentRow = val;
    },
    filterTag(value, row) {
      return row.isValid == value;
    },
    beforeClose() {
      this.cancelEdit()
    },
    cancelEdit() {
      this.$refs['bannerForm'].resetFields()
      this.editFormVisible = false
    },
    getBanners() {
      this.loading = true;
      reqBannerList({
          isvalid: 'all',
          isBack: true
        }).then(res => {
          console.log(res)
          this.bannerList = res.data.data.bannerList
          this.listLength = this.bannerList.length
          this.loading = false;
        })
        .catch(err => {
          this.$message.error(res.data.msg);
          this.loading = false;
        })
    },
    showDialog: function(index, row) {
      this.editFormVisible = true;
      this.showProgress = false
      this.$nextTick(function() {
        // DOM 更新了
        let b = document.getElementById('pic_wrap').clientWidth
        document.getElementById('pic_wrap').style.height = b * 0.46 + 'px'
      })
      this.imageUrl = ''
      if (index == '-1') { //新增
        this.isNewOrChanged = true
        this.bannerForm = Object.assign({}, this.bannerForm_bak)
      } else { //编辑
        this.imageUrl = row.imageUrl
        this.isNewOrChanged = false
        this.bannerForm = Object.assign({}, row);
      }
    },
    bannerSubmit: function() {
      this.$refs['bannerForm'].validate(valid => {
        if (valid) {
          if (this.isNewOrChanged) {
            this.$message({
              type: 'info',
              message: '请先点击上传按钮将图片上传'
            })
            return
          }
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            reqBannerSave(this.bannerForm).then(res => {
              if (res.data.msg == "成功") {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.editFormVisible = false;
                this.getBanners();
              }
            })
          }).catch()
        }
      });
    }
  },
  mounted() {
    this.getBanners();
    this.bannerForm_bak = Object.assign({}, this.bannerForm)
  }
};

</script>
<style lang="scss" scoped>
.userEditFormP {
  .el-dialog--small {
    width: 600px !important;
  }
}

.wrap-pic {
  margin-bottom: 10px;
  width: 100%;
  height: 150px;
  background: #d1dbe5;
  overflow: hidden;
  position: relative;
  input {
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    opacity: 0;
  }
  p {
    text-align: center;
    color: #8391a5;
  }
  img {
    position: absolute;
    top: 0;
    width: 100%;
  }
}

</style>
