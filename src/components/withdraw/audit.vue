<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/withdraw/list' }">提现管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ crumbName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
      <el-col :span="24" class="toolbarff">
        <el-form :model="withdraw_info" ref='editForm' label-width='100px'>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='用户姓名'>
                <el-input :value="(withdraw_info.user ? withdraw_info.user.userName : '')" placeholder="用户姓名" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='提现金额'>
                <el-input v-model="withdraw_info.drawAmount" placeholder="提现金额" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='申请时间' >
                <el-input v-model="withdraw_info.created" placeholder="申请时间" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='联系电话'>
                <el-input :value="(withdraw_info.user ? withdraw_info.user.userPhone : '')" placeholder="联系电话" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='危险系数'>
      				  <el-select v-model="withdraw_info.perilRatio" placeholder="危险系数" :disabled="!isAudit">
        	    		<el-option v-for="item in riskFactorOptions" :key="item.value" :label="item.label" :value="item.value">
        	    		</el-option>
      	    		</el-select>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='审核结论'>
      				  <el-select v-model="withdraw_info.auditStatus" placeholder="审核结论" :disabled="!isAudit">
        	    		<el-option v-for="item in auditStatusOptions" :key="item.value" :label="item.label" :value="item.value">
        	    		</el-option>
      	    		</el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg"  :gutter='20'>
            <el-col :span='8' :offset="4">
              <el-form-item label='可提现金额'>
                <el-input v-model="withdraw_info.userBalance" placeholder="可提现金额" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='审核意见'>
        				<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" :disabled="!isAudit"
        				  v-model="withdraw_info.auditMemo">
        				</el-input>
              </el-form-item>
            </el-col>
          </el-row>                  
          <el-row v-if="isAudit" type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16' :offset='10'>
    			 	  <el-button type="success" @click='editSubmit'>提交</el-button>
    			    <el-button type="warning" @click='resetOrder'>重置</el-button>
    			    <el-button type="info" @click='toOrderList'>返回列表</el-button>
    		    </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
import { reqWithdrawAudit } from '../../api/api';
export default {
  data() {
    return {
      withdraw_info: {},
      withdraw_info_bak: {},
      riskFactorOptions: [{
      		value: '0',
      		label: "正常"
      	},{
          value: '1',
          label: "低"
        },{
          value: '2',
          label: "中"
        },{
      		value: '3',
      		label: "高"
      	}
      ],
      auditStatusOptions: [{
      		value: '0',
      		label: '待审核'
      	},{
      		value: '1',
      		label: '已通过'
      	},{
      		value: '2',
      		label: '不通过'
      	},{
      		value: '3',
      		label: '暂不处理'
      	}
      ],
      isAudit: true,
      crumbName: '提现审核'
    }
  },
  methods: {
    editSubmit() {
      let p = Object.assign({}, this.withdraw_info)
      p.created = new Date(p.created).getTime()
    	reqWithdrawAudit(p).then((res) => {
        if (res.data.code == 0) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
        } else {
            this.$message.error(res.data.msg)
        }
    	}).catch(err => {})
    },
    resetOrder() {
    	this.withdraw_info = Object.assign( {}, this.withdraw_info_bak)    	
    },
    toOrderList() {
    	this.$router.push('/withdraw/list')
    }
  },
  mounted() {
    let isDetail = this.$route.params.isDetail
    if (isDetail) {
      this.isAudit = false
      this.crumbName = '提现详情'
    }
    let w = this.$route.params.withdraw_info
    if (w) {
  	   this.withdraw_info = w
       Object.assign( this.withdraw_info_bak, w )
    } else {
       this.$router.push("/withdraw/list")
    }
  }
}

</script>
