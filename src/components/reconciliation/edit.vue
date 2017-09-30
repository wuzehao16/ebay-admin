<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/reconciliation/list' }">对账管理</el-breadcrumb-item>
        <el-breadcrumb-item>对账处理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
      <el-col :span="24" class="toolbar">
        <el-form :model="reconc" ref='editForm' label-width='100px'>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='交易号'>
                <el-input v-model="reconc.trade_id" placeholder="交易号" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='交易类型'>
				<el-select v-model.number="reconc.trade_type" placeholder="交易类型" disabled>
	    		<el-option v-for="item in tradeTypeOptions" :key="item.value" :label="item.label" :value="item.value">
	    		</el-option>
	    		</el-select>
              </el-form-item>
            </el-col>
          </el-row>        
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='用户姓名'>
                <el-input v-model="reconc.user_name" placeholder="用户姓名" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='联系电话'>
                <el-input v-model="reconc.tel" placeholder="联系电话" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='平-交易金额（元）'>
                <el-input v-model="reconc.platform_amount" placeholder="平-交易金额（元）" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='E-交易金额（元）'>
                <el-input v-model="reconc.ebay_amount" placeholder="E-交易金额（元）" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>          

          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='平-交易时间' >
                <el-input v-model="reconc.platform_time" placeholder="平-交易时间" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='E-交易时间'>
                <el-input v-model="reconc.ebay_time" placeholder="E-交易时间" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='8'>
              <el-form-item label='平台状态'>
				<el-select v-model.number="reconc.platform_status" placeholder="平台状态" disabled>
	    		<el-option v-for="item in platformStatusOptions" :key="item.value" :label="item.label" :value="item.value">
	    		</el-option>
	    		</el-select>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='Ebay状态'>
				<el-select v-model.number="reconc.ebay_status" placeholder="Ebay状态" disabled>
	    		<el-option v-for="item in ebayStatusOptions" :key="item.value" :label="item.label" :value="item.value">
	    		</el-option>
	    		</el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg"  :gutter='20'>
            <el-col :span='8' :offset="4">
              <el-form-item label='核对状态'>
				<el-select v-model.number="reconc.reconc_status" placeholder="核对状态">
	    		<el-option v-for="item in reconcStatusOptions" :key="item.value" :label="item.label" :value="item.value">
	    		</el-option>
	    		</el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center" :gutter='20'>
            <el-col :span='16'>
              <el-form-item label='审核意见'>
				<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容"
				  v-model="reconc.deal_opinion">
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
import { reqReconciliationEdit } from '../../api/api';

export default {
  data() {
    return {
      reconc: {},
      reconc_bak: {},
      reconcStatusOptions: [{
      		value: 0,
      		label: '异常'
      	},{
      		value: 1,
      		label: '修复中'
      	},{
      		value: 2,
      		label: '正常'
      	}
      ],
      platformStatusOptions: [{
      		value: 0,
      		label: '处理中'
      	},{
      		value: 1,
      		label: '成功'
      	},{
      		value: 2,
      		label: '失败'
      	}
      ],
      ebayStatusOptions: [{
      		value: 0,
      		label: '处理中'
      	},{
      		value: 1,
      		label: '成功'
      	},{
      		value: 2,
      		label: '失败'
      	}
      ],
      tradeTypeOptions: [{
      		value: 0,
      		label: '收入'
      	},{
      		value: 1,
      		label: '支出'
      	}
      ],
    }
  },
  methods: {
    editSubmit() {
    	reqReconciliationEdit(this.reconc).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
    	})
    },
    resetOrder() {
    	this.reconc = Object.assign( {}, this.reconc_bak)    	
    },
    toOrderList() {
    	this.$router.push('/reconciliation/list')
    }

  },
  mounted() {
  	this.reconc = this.$route.params.reconciliation
	Object.assign( this.reconc_bak, this.$route.params.reconciliation )
  }
}

</script>
