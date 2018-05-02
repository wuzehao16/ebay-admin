import axios from 'axios'

export const staticBase = (process.env.NODE_ENV === 'production') ? '' : '/static'

//banner
export const reqBannerList = params => { return axios.get(`/sell/seller/banner/list`, {params: params}) }
export const reqBannerSave = params => { return axios.post(`/sell/seller/banner/save`, params) }
//category
export const reqCategoryList = params => { return axios.get(`/sell/seller/category/list`, {params: params}) }
export const reqCategorySave = params => { return axios.post(`/sell/seller/category/save`, params) }
export const reqCategoryById = params => { return axios.get(`/sell/seller/category/queryById`, {params: params}) }

//订单列表
export const reqGetOrderList = params => { return axios.get(`/sell/seller/order/orderlistShow`, { params: params }) }
export const reqCancelOrder = params => { return axios.put(`/sell/seller/order/cancel/${params.openid}/${params.orderId}`) }

export const reqProductName = params => { return axios.get(`/sell/seller/product/list`, { params: params }) }
//物流
export const reqLogistics = params => { return axios.get(`/sell/ebay/logistics/order/getTracking/${params.logisticsNo}`)}

//订单异常
//联想输入订单号
export const reqNumToList = params => { return axios.get(`/sell/seller/order/list`, { params: params }) }

export const reqGetExOrderList = params => { return axios.get(`/sell/ebay/error/list`, { params: params }) }

export const reqEditExOrder = params => { return axios.put(`/sell/ebay/error/save`,  params) }
export const reqDeleteExOrder = params => { return axios.delete(`/sell/ebay/error/delete/${params.id}`) }

export const reqAddExOrder = params => { return axios.post(`/sell/ebay/error/create`, params) }
//订单轨迹
export const reqPutExOrderRcList = params => { return axios.post(`/sell/ebay/errorrc/save`, params) }
export const reqaddExOrderRcList = params => { return axios.post(`/sell/ebay/errorrc/create`, params) }
export const reqDeleteExOrderRcList = params => { return axios.delete(`/sell/ebay/errorrc/delete`, params) }
export const reqGetExOrderRcList = params => { return axios.get(`/sell/ebay/errorrc/list`, { params: params }) }
//微信
export const reqGetWechatMenus = params => { return axios.get(`/sell/wechat/menu/list`, { params: params }) }
export const reqEditWechatMenu = params => { return axios.patch(`/sell/wechat/menu`, params) }
export const reqDeleteWechatMenu = params => { return axios.delete(`/sell/wechat/menu`, { params: params }) }
export const reqAddWechatMenu = params => { return axios.post(`/sell/wechat/menu`, params) }
export const reqSyncWechatMenu = params => { return axios.post(`/sell/wechat/menu/synchro`,params) }

//账户管理
export const reqGetAccountList = params => { return axios.get(`/sell/user/account/list`, { params: params }) }
export const reqGetAccountSteted = params => { return axios.get(`/sell/user/account/${params.id}`,{params:params}) }

export const requestLogin = params => { return axios.post(`/sell/login`, params).then(res => res.data) }

export const reqSaveUserProfile = params => { return axios.post(`/sell/user/profile`, params).then(res => res.data) }

export const reqGetUserList = params => { return axios.get(`/sell/ebay/user/list`, { params: params }) }
export const reqDeleteUser = params => { return axios.delete(`/sell/ebay/user/${params.id}/delete`) }
export const reqEditUser = params => { return axios.post(`/sell/ebay/user/${params.id}/update`, params) }
//地址
export const reqAddressJson = params => { return axios.get(`${staticBase}/resource/address4.json`) }
//订单管理
export const reqGetOrder = params => { return axios.get(`/sell/order/getorder`, { params: params }) }
export const reqEditOrder = params => { return axios.put(`/sell/seller/order/update`,  params) }
export const reqAddOrder = params => { return axios.post(`/sell/buyer/order/create`, params) }
export const reqGetOrderDetail = params => { return axios.get(`/sell/seller/order/detail/${params.orderId}`) }

//提现管理
export const reqWithdrawList = params => { return axios.get(`/sell/user/account/withdraw/list`, { params: params }) }
export const reqWithdrawAudit = params => { return axios.post(`/sell/user/account/withdraw/${params.id}/edit`, params) }

//对账管理
export const reqCheckList = params => { return axios.get(`/sell/user/account/check/list`, { params: params }) }

export const reqReconciliationEdit = params => { return axios.post(`/sell/user/account/check/${params.id}/edit`,  params.params ) }
export const reqReconciliationDetail = params => { return axios.get(`/sell/reconciliation/detail`, { params: params }) }

export const reqWechatReply = params => { return axios.get(`/sell/wechat/wxMessage/list`, { params: params }) }
export const reqWechatReplyEdit = params => { return axios.get(`/sell//wechat/wxMessage/${params.id}`, { params: params }) }
export const reqWechatReplyDelete = params => { return axios.delete(`/sell/wechat/wxMessage/${params}`) }
export const reqWechatReplyAdd = params => { return axios.get(`/sell/wechat/wxMessage`, { params: params }) }
export const reqGoodsList = params => { return axios.get(`/sell/seller/product/list`, { params: params }) }
export const reqSaveGoods = params => { return axios.put(`/sell/seller/product/save`, params) }
export const reqAuditGoods = params => { return axios.post(`/sell/seller/product/audit?productId=${params.productId}&auditStatus=${params.auditStatus}`, params) }
export const reqGoodsDetail = params => { return axios.get(`/sell/buyer/product/detail/${params.productId}`) }
export const reqOnSaleGoods = params => { return axios.put(`/sell/seller/product/on_sale/${params.productId}`) }
export const reqOffSaleGoods = params => { return axios.put(`/sell/seller/product/off_sale/${params.productId}`) }
//获取ebay商品
export const reqEbayGoods = params => { return axios.get(`/sell/ebay/getGoodsInfo`, { params: params }) }

export const reqDistrList = params => { return axios.get(`/sell/distribution/list`, {params: params}) }
export const reqDistrDetail = params => { return axios.get(`/sell/distribution/${params.id}`) }
export const reqDistrEdit = params => { return axios.post(`/sell/distribution/${params.distribution.id}/edit`, params.distribution) }
