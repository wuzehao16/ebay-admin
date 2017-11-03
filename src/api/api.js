import Mock from '../mock'
Mock.init()
import axios from 'axios'
let base = '' 

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data) }

export const reqSaveUserProfile = params => { return axios.post(`${base}/user/profile`, params).then(res => res.data) }

export const reqGetUserList = params => { return axios.get(`${base}/user/list`, { params: params }) }

export const reqGetUserList2 = params => { return axios.get(`${base}/userb/list`, { params: params }) }

export const reqDeleteUser = params => { return axios.get(`${base}/user/delete`, { params: params }) }

export const reqAddUser = params => { return axios.get(`${base}/user/add`, { params: params }) }

export const reqEditUser = params => { return axios.get(`${base}/user/edit`, { params: params }) }

export const reqGetBookListPage = params => { return axios.get(`${base}/book/list`, { params: params }) }

export const reqDeleteBook = params => { return axios.get(`${base}/book/delete`, { params: params }) }

export const reqEditBook = params => { return axios.get(`${base}/book/edit`, { params: params }) }

export const reqBatchDeleteBook = params => { return axios.get(`${base}/book/batchdelete`, { params: params }) }

export const reqAddBook = params => { return axios.get(`${base}/book/add`, { params: params }) }

//订单管理
export const reqGetOrderList = params => { return axios.get(`${base}/order/list`, { params: params }) }

export const reqGetOrder = params => { return axios.get(`${base}/order/getorder`, { params: params }) }

export const reqEditOrder = params => { return axios.get(`${base}/order/edit`, { params: params }) }

export const reqAddOrder = params => { return axios.get(`${base}/order/add`, { params: params }) }

//订单异常
export const reqGetExOrderList = params => { return axios.get(`${base}/ex_order/list`, { params: params }) }

export const reqEditExOrder = params => { return axios.get(`${base}/ex_order/edit`, { params: params }) }

export const reqAddExOrder = params => { return axios.get(`${base}/ex_order/add`, { params: params }) }

//分销结算
export const reqGetPlaceList = params => { return axios.get(`${base}/place_settle/list`, { params: params }) }
export const reqGetPlaceEdit = params => { return axios.get(`${base}/place_settle/edit`, { params: params }) }
export const reqGetPlaceSettle = params => { return axios.get(`${base}/place_settle/settle`, { params: params }) }

//账户管理
export const reqGetAccountList = params => { return axios.get(`${base}/account/list`, { params: params }) }
export const reqGetAccountSteted = params => { return axios.get(`${base}/account/account_stated`, { params: params }) }

//提现管理
export const reqGetWithdrawList = params => { return axios.get(`${base}/withdraw/list`, { params: params }) }
export const reqGetWithdrawAudit = params => { return axios.get(`${base}/withdraw/audit`, { params: params }) }
export const reqGetWithdrawIssue = params => { return axios.get(`${base}/withdraw/issue`, { params: params }) }
//对账管理
export const reqReconciliationList = params => { return axios.get(`${base}/reconciliation/list`, { params: params }) }
export const reqReconciliationEdit = params => { return axios.get(`${base}/reconciliation/edit`, { params: params }) }
export const reqReconciliationDetail = params => { return axios.get(`${base}/reconciliation/detail`, { params: params }) }

//微信管理
export const reqGetWechatMenus = params => { return axios.get(`${base}/wechat/menulist`, { params: params }) }
export const reqEditWechatMenu = params => { return axios.get(`${base}/wechat/menuedit`, { params: params }) }
export const reqDeleteWechatMenu = params => { return axios.get(`${base}/wechat/menudelete`, { params: params }) }
export const reqAddWechatMenu = params => { return axios.get(`${base}/wechat/menuadd`, { params: params }) }
export const reqSyncWechatMenu = params => { return axios.get(`${base}/wechat/menusync`, { params: params }) }

export const reqWechatReply = params => { return axios.get(`${base}/wechat/replylist`, { params: params }) }
export const reqWechatReplyEdit = params => { return axios.get(`${base}/wechat/replyedit`, { params: params }) }
export const reqWechatReplyDelete = params => { return axios.get(`${base}/wechat/replydelete`, { params: params }) }
export const reqWechatReplyAdd = params => { return axios.get(`${base}/wechat/replyadd`, { params: params }) }

export const reqGoodsList = params => { return axios.get(`${base}/goods/list`, { params: params }) }
export const reqEbayGoods = params => { return axios.get(`${base}/goods/from_ebay`, { params: params }) }


// export * default api