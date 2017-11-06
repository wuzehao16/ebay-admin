import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export const requestLogin = params => { return axios.post(`/sell/login`, params).then(res => res.data) }

export const reqSaveUserProfile = params => { return axios.post(`/sell/user/profile`, params).then(res => res.data) }

export const reqGetUserList = params => { return axios.get(`/sell/ebay/user/list`, { params: params }) }
export const reqDeleteUser = params => { return axios.delete(`/sell/ebay/user/${params.id}/delete`) }
export const reqEditUser = params => { return axios.post(`/sell/ebay/user/${params.id}/update`, params) }



export const reqGetUserList2 = params => { return axios.get(`/sell/userb/list`, { params: params }) }


export const reqGetBookListPage = params => { return axios.get(`/sell/book/list`, { params: params }) }

export const reqDeleteBook = params => { return axios.get(`/sell/book/delete`, { params: params }) }

export const reqEditBook = params => { return axios.get(`/sell/book/edit`, { params: params }) }

export const reqBatchDeleteBook = params => { return axios.get(`/sell/book/batchdelete`, { params: params }) }

export const reqAddBook = params => { return axios.get(`/sell/book/add`, { params: params }) }

//订单管理
export const reqGetOrderList = params => { return axios.get(`/sell/order/list`, { params: params }) }

export const reqGetOrder = params => { return axios.get(`/sell/order/getorder`, { params: params }) }

export const reqEditOrder = params => { return axios.get(`/sell/order/edit`, { params: params }) }

export const reqAddOrder = params => { return axios.get(`/sell/order/add`, { params: params }) }

//分销结算
export const reqGetPlaceList = params => { return axios.get(`/sell/place_settle/list`, { params: params }) }
export const reqGetPlaceEdit = params => { return axios.get(`/sell/place_settle/edit`, { params: params }) }
export const reqGetPlaceSettle = params => { return axios.get(`/sell/place_settle/settle`, { params: params }) }

//账户管理
export const reqGetAccountList = params => { return axios.get(`/sell/account/list`, { params: params }) }
export const reqGetAccountSteted = params => { return axios.get(`/sell/account/account_stated`, { params: params }) }

//提现管理
export const reqWithdrawList = params => { return axios.get(`/sell/user/account/withdraw/list`, { params: params }) }
export const reqWithdrawAudit = params => { return axios.post(`/sell/user/account/withdraw/${params.id}/edit`, params) }


export const reqGetWithdrawIssue = params => { return axios.get(`/sell/withdraw/issue`, { params: params }) }
//对账管理
export const reqCheckList = params => { return axios.get(`/sell/user/account/check/list`, { params: params }) }

export const reqReconciliationEdit = params => { return axios.post(`/sell/user/account/check/${params.id}/edit`,  params.params ) }
export const reqReconciliationDetail = params => { return axios.get(`/sell/reconciliation/detail`, { params: params }) }

//微信管理
export const reqGetWechatMenus = params => { return axios.get(`/sell/wechat/menulist`, { params: params }) }
export const reqEditWechatMenu = params => { return axios.get(`/sell/wechat/menuedit`, { params: params }) }
export const reqDeleteWechatMenu = params => { return axios.get(`/sell/wechat/menudelete`, { params: params }) }
export const reqAddWechatMenu = params => { return axios.get(`/sell/wechat/menuadd`, { params: params }) }
export const reqSyncWechatMenu = params => { return axios.get(`/sell/wechat/menusync`, { params: params }) }

export const reqWechatReply = params => { return axios.get(`/sell/wechat/replylist`, { params: params }) }
export const reqWechatReplyEdit = params => { return axios.get(`/sell/wechat/replyedit`, { params: params }) }
export const reqWechatReplyDelete = params => { return axios.get(`/sell/wechat/replydelete`, { params: params }) }
export const reqWechatReplyAdd = params => { return axios.get(`/sell/wechat/replyadd`, { params: params }) }

export const reqGoodsList = params => { return axios.get(`/sell/seller/product/list`, { params: params }) }
export const reqSaveGoods = params => { return axios.post(`/sell/seller/product/save`, params) }
export const reqGoodsDetail = params => { return axios.get(`/sell/buyer/product/detail`, { params: params }) }
export const reqOnSaleGoods = params => { return axios.post(`/sell/seller/product/on_sale`, params,  {headers: {'Content-Type':'text/plain'}}) }
export const reqOffSaleGoods = params => { return axios.post(`/sell/seller/product/off_sale`, params, {headers: {'Content-Type':'text/plain'}}) }
//获取ebay商品
export const reqEbayGoods = params => { return axios.get(`/sell/ebay/getGoodsInfo`, { params: params }) }



export const reqDistrList = params => { return axios.get(`/sell/distribution/list`, {params: params}) }
export const reqDistrDetail = params => { return axios.get(`/sell/distribution/${params.id}`) }
export const reqDistrEdit = params => { return axios.post(`/sell/distribution/${params.id}/edit`, params) }
