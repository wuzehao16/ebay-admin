import * as api from './api'
import axios from 'axios'
export const reqGetUserList = params => { return axios.get(`sell/user/list`, { params: params }) }



//订单列表


export const reqGetOrderList = params => { return axios.get(`/api/seller/order/orderlist`, { params: params }) }
export const reqCancelOrder = params => { return axios.get(`/api/seller/order/cancel`, { params: params }) }

export const reqProductName = params => { return axios.get(`/api/seller/product/list`, { params: params }) }



export const reqGetOrder = params => { return axios.get(`/order/getorder`, { params: params }) }

export const reqEditOrder = params => { return axios.get(`/order/edit`, { params: params }) }

export const reqAddOrder = params => { return axios.post(`/api/buyer/order/create`, params) }
//订单异常
//联想输入订单号
export const reqNumToList = params => { return axios.get(`/api/seller/order/list`, { params: params }) }

export const reqGetExOrderList = params => { return axios.get(`api/ebay/error/list`, { params: params }) }

export const reqEditExOrder = params => { return axios.post(`api/ebay/error/save`,  params) }
export const reqDeleteExOrder = params => { return axios.post(`api/ebay/error/delete`, params) }

export const reqAddExOrder = params => { return axios.post(`api/ebay/error/create`, params) }
//订单轨迹
export const reqPutExOrderRcList = params => { return axios.post(`api/ebay/errorrc/save`, params) }
export const reqEditExOrderRcList = params => { return axios.post(`api/ebay/errorrc/create`, params) }
export const reqDeleteExOrderRcList = params => { return axios.post(`api/ebay/errorrc/delete`, params) }
export const reqGetExOrderRcList = params => { return axios.get(`api/ebay/errorrc/list`, { params: params }) }

//微信
export const reqGetWechatMenus = params => { return axios.get(`api/wechat/menu/list`, { params: params }) }
export const reqEditWechatMenu = params => { return axios.patch(`api/wechat/menu`, params) }
export const reqDeleteWechatMenu = params => { return axios.delete(`api/wechat/menu`, { params: params }) }
export const reqAddWechatMenu = params => { return axios.post(`api/wechat/menu`, params) }
export const reqSyncWechatMenu = params => { return axios.post(`api/wechat/menu/synchro`,params) }

//账户管理
export const reqGetAccountList = params => { return axios.get(`/api/user/account/list`, { params: params }) }
export const reqGetAccountSteted = params => { return axios.get(`/api/user/account/${params.id}`,{params:params}) }
export default api
