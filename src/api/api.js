import axios from 'axios'

export const requestLogin = params => { return axios.post(`api/login`, params).then(res => res.data) }

export const reqSaveUserProfile = params => { return axios.post(`api/user/profile`, params).then(res => res.data) }

export const reqGetUserList = params => { return axios.get(`api/ebay/user/list`, { params: params }) }
export const reqDeleteUser = params => { return axios.delete(`api/ebay/user/${params.id}/delete`) }
export const reqEditUser = params => { return axios.post(`api/ebay/user/${params.id}/update`, params) }



export const reqGetUserList2 = params => { return axios.get(`api/userb/list`, { params: params }) }


export const reqGetBookListPage = params => { return axios.get(`api/book/list`, { params: params }) }

export const reqDeleteBook = params => { return axios.get(`api/book/delete`, { params: params }) }

export const reqEditBook = params => { return axios.get(`api/book/edit`, { params: params }) }

export const reqBatchDeleteBook = params => { return axios.get(`api/book/batchdelete`, { params: params }) }

export const reqAddBook = params => { return axios.get(`api/book/add`, { params: params }) }

//订单管理
export const reqGetOrderList = params => { return axios.get(`api/order/list`, { params: params }) }

export const reqGetOrder = params => { return axios.get(`api/order/getorder`, { params: params }) }

export const reqEditOrder = params => { return axios.get(`api/order/edit`, { params: params }) }

export const reqAddOrder = params => { return axios.get(`api/order/add`, { params: params }) }

//订单异常
export const reqGetExOrderList = params => { return axios.get(`api/ex_order/list`, { params: params }) }

export const reqEditExOrder = params => { return axios.get(`api/ex_order/edit`, { params: params }) }

export const reqAddExOrder = params => { return axios.get(`api/ex_order/add`, { params: params }) }

//分销结算
export const reqGetPlaceList = params => { return axios.get(`api/place_settle/list`, { params: params }) }
export const reqGetPlaceEdit = params => { return axios.get(`api/place_settle/edit`, { params: params }) }
export const reqGetPlaceSettle = params => { return axios.get(`api/place_settle/settle`, { params: params }) }

//账户管理
export const reqGetAccountList = params => { return axios.get(`api/account/list`, { params: params }) }
export const reqGetAccountSteted = params => { return axios.get(`api/account/account_stated`, { params: params }) }

//提现管理
export const reqGetWithdrawList = params => { return axios.get(`api/withdraw/list`, { params: params }) }
export const reqGetWithdrawAudit = params => { return axios.get(`api/withdraw/audit`, { params: params }) }
export const reqGetWithdrawIssue = params => { return axios.get(`api/withdraw/issue`, { params: params }) }
//对账管理
export const reqReconciliationList = params => { return axios.get(`api/reconciliation/list`, { params: params }) }
export const reqReconciliationEdit = params => { return axios.get(`api/reconciliation/edit`, { params: params }) }
export const reqReconciliationDetail = params => { return axios.get(`api/reconciliation/detail`, { params: params }) }

//微信管理
export const reqGetWechatMenus = params => { return axios.get(`api/wechat/menulist`, { params: params }) }
export const reqEditWechatMenu = params => { return axios.get(`api/wechat/menuedit`, { params: params }) }
export const reqDeleteWechatMenu = params => { return axios.get(`api/wechat/menudelete`, { params: params }) }
export const reqAddWechatMenu = params => { return axios.get(`api/wechat/menuadd`, { params: params }) }
export const reqSyncWechatMenu = params => { return axios.get(`api/wechat/menusync`, { params: params }) }

export const reqWechatReply = params => { return axios.get(`api/wechat/replylist`, { params: params }) }
export const reqWechatReplyEdit = params => { return axios.get(`api/wechat/replyedit`, { params: params }) }
export const reqWechatReplyDelete = params => { return axios.get(`api/wechat/replydelete`, { params: params }) }
export const reqWechatReplyAdd = params => { return axios.get(`api/wechat/replyadd`, { params: params }) }

export const reqGoodsList = params => { return axios.get(`api/seller/product/list`, { params: params }) }
export const reqSaveGoods = params => { return axios.post(`api/seller/product/save`, params) }
export const reqGoodsDetail = params => { return axios.get(`api/buyer/product/detail`, { params: params }) }

export const reqEbayGoods = params => { return axios.get(`api/goods/from_ebay`, { params: params }) }
