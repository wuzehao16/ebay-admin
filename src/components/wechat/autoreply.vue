<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>微信管理</el-breadcrumb-item>
        <el-breadcrumb-item>自动回复设置</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" style="margin-top:20px;">
        <el-button @click="showAddDialog">新增</el-button>
    </el-col>
    <el-col :span="24" class="warp-main">
    <el-table ref="singleTable" :data="replys" v-loading='loading'  style="width: 100%">
    	<el-table-column type="expand">
    		<template scope="props">
    			<el-form label-position="right" inline class="demo-table-expand">
            <el-form-item label="消息类型">
              <el-radio-group v-model="props.row.reply_type">
                <el-radio :label="0">图文消息</el-radio>
                <el-radio :label="1">文本消息</el-radio>
              </el-radio-group>
            </el-form-item>
    				<el-form-item label="标题">
                		<el-input v-model="props.row.reply_title" placeholder="标题"></el-input>
    				</el-form-item>

    				<el-form-item label="关键字">
                		<el-input v-model="props.row.reply_key" placeholder="关键字"></el-input>
    				</el-form-item>
    				<el-form-item label="链接地址">
                		<el-input v-model="props.row.reply_url" placeholder="链接地址"></el-input>
    				</el-form-item>
            <el-form-item label="图片">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false" :loading="true"
                :on-success="(res, file)=>{return handleAvatarSuccess(res, file, props.row)}"
                :before-upload="beforeAvatarUpload">
                <img v-if="props.row.reply_img" :src="props.row.reply_img" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="设为默认">
              <el-radio-group v-model="props.row.reply_default">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="内容" style="width:100%;">
              <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容"
                v-model="props.row.reply_content" style="width:300%;">
              </el-input>
            </el-form-item>
    				<el-form-item label=" ">
        				<el-button @click="editSubmit(props.row)">保存</el-button>
    				</el-form-item>
    			</el-form>
    		</template>
    	</el-table-column>
    	<el-table-column type="index" width="60"> </el-table-column>
    	<el-table-column property="reply_id" label="编号" width='200'></el-table-column>
      <el-table-column property="reply_title" label="标题"></el-table-column>
    	<el-table-column property="reply_key" label="关键字"></el-table-column>
    	<el-table-column property="create_time" label="创建时间" width='200'></el-table-column>
    	<el-table-column property="update_time" label="更新时间" width='200'></el-table-column>
    
	    <el-table-column fixed="right" label="操作" width='100'>
        	<template scope="scope">
            	<el-button size="small" @click="deleteSubmit(scope.row,scope.$index)">删除</el-button>
        	</template>
    	</el-table-column>
  	</el-table>
	
      <!--新增界面-->
      <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
          <el-form :model="addForm" label-width="80px" label-position="right">
            <el-form-item label="消息类型">
              <el-radio-group v-model="addForm.reply_type">
                <el-radio :label="0">图文消息</el-radio>
                <el-radio :label="1">文本消息</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="标题">
                    <el-input v-model="addForm.reply_title" placeholder="标题"></el-input>
            </el-form-item>

            <el-form-item label="关键字">
                    <el-input v-model="addForm.reply_key" placeholder="关键字"></el-input>
            </el-form-item>
            <el-form-item label="链接地址">
                    <el-input v-model="addForm.reply_url" placeholder="链接地址"></el-input>
            </el-form-item>
            <el-form-item label="图片">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false" :loading="true"
                :on-success="(res, file)=>{return handleAvatarSuccess2(res, file, addForm)}"
                :before-upload="beforeAvatarUpload">
                <img v-if="addForm.reply_img" :src="addForm.reply_img" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="设为默认">
              <el-radio-group v-model="addForm.reply_default">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="内容">
              <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容"
                v-model="addForm.reply_content">
              </el-input>
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }  
</style>


<script>
  import {  reqWechatReplyEdit, reqWechatReplyDelete,reqWechatReplyAdd, reqWechatReply } from '../../api';

  export default{
    data(){
      return {
      	syncLoading: false,
      	label_menu: "",
        loading: false,
        replys: [],
        showflag: true,

        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addForm: {
          reply_title: '',
          reply_type: 0,
          reply_key: '',
          reply_url: '',
          reply_img: '',
          reply_default: 0,
          reply_content: ''
        }  	
            
      }
    },
    methods: {
      getReplyList() {
  	    this.loading = true
        reqWechatReply().then((res) => {
          this.replys = res.data.replys
          this.loading = false
        })
      },
      editSubmit(row) {
      	reqWechatReplyEdit(row).then((res) => {
              this.$message({
                message: '提交成功',
                type: 'success'
              });
      	})      	
      },
      deleteSubmit(row,index) {
      	reqWechatReplyDelete({index}).then((res) => {
      		this.replys.splice(index,1)
              this.$message({
                message: '提交成功',
                type: 'success'
              });
      	})       	
      },
      showAddDialog() {
        this.addFormVisible = true
        this.addForm = {
          reply_title: '',
          reply_type: 0,
          reply_key: '',
          reply_url: '',
          reply_img: '',
          reply_default: 0,
          reply_content: ''
        } 
      },
      addSubmit() {
      	this.addLoading = true
      	reqWechatReplyAdd(this.addForm).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.addLoading = false
            this.addFormVisible = false
            this.getReplyList()
            this.showflag = true
    	   }) 
      },
      //upload图片相关
      handleAvatarSuccess(res, file, row) {
        row.reply_img = URL.createObjectURL(file.raw);
      },
      handleAvatarSuccess2(res, file, addForm) {
        addForm.reply_img = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }      
    },
    mounted() {
      this.getReplyList()
    }
  }
</script>

