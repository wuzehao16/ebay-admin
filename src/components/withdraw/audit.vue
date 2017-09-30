<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/withdraw/list' }">提现管理</el-breadcrumb-item>
        <el-breadcrumb-item>提现审核</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
      <el-col :span="24" class="toolbarff">
        <el-form :model="withdraw_info" ref='editForm' label-width='100px'>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='用户姓名'>
                <el-input v-model="withdraw_info.user_name" placeholder="用户姓名" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='提现金额'>
                <el-input v-model="withdraw_info.withdraw_amount" placeholder="提现金额" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='申请时间' >
                <el-input v-model="withdraw_info.apply_time" placeholder="申请时间" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='联系电话'>
                <el-input v-model="withdraw_info.tel" placeholder="联系电话" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='危险系数'>
				<el-select v-model.number="withdraw_info.risk_factor" placeholder="危险系数">
	    		<el-option v-for="item in riskFactorOptions" :key="item.value" :label="item.label" :value="item.value">
	    		</el-option>
	    		</el-select>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='审核结论'>
				<el-select v-model.number="withdraw_info.audit_status" placeholder="审核结论">
	    		<el-option v-for="item in auditStatusOptions" :key="item.value" :label="item.label" :value="item.value">
	    		</el-option>
	    		</el-select>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row type="flex" class="row-bg"  :gutter='20'>
            <el-col :span='8' :offset="4">
              <el-form-item label='可提现金额'>
                <el-input v-model="withdraw_info.withdrawable_balance" placeholder="可提现金额" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='审核意见'>
				<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容"
				  v-model="withdraw_info.audit_opinion">
				</el-input>
              </el-form-item>
            </el-col>
          </el-row>                  
          
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
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
import { reqGetWithdrawAudit } from '../../api/api';

export default {
  data() {
    return {
      withdraw_info: {},
      withdraw_info_bak: {},
      riskFactorOptions: [{
      		value: 0,
      		label: "低"
      	},{
      		value: 1,
      		label: "中"
      	},{
      		value: 2,
      		label: "高"
      	}
      ],
      auditStatusOptions: [{
      		value: 0,
      		label: '待审核'
      	},{
      		value: 1,
      		label: '已通过'
      	},{
      		value: 2,
      		label: '不通过'
      	},{
      		value: 3,
      		label: '暂不处理'
      	}
      ]
    }
  },
  methods: {
    editSubmit() {
    	reqGetWithdrawAudit(this.withdraw_info).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
    	})
    },
    resetOrder() {
    	this.withdraw_info = Object.assign( {}, this.withdraw_info_bak)    	
    },
    toOrderList() {
    	this.$router.push('/withdraw/list')
    }

  },
  mounted() {
  	this.withdraw_info = this.$route.params.withdraw_info
	Object.assign( this.withdraw_info_bak, this.$route.params.withdraw_info )
  }
}

</script>
