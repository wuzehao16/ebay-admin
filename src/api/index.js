import * as api from './api'
import axios from 'axios'
export const reqGetUserList = params => { return axios.get(`/sell/user/list`, { params: params }) }



//订单列表


export const reqGetOrderList = params => { return axios.get(`/sell/seller/order/orderlist`, { params: params }) }
export const reqCancelOrder = params => { return axios.get(`/sell/seller/order/cancel`, { params: params }) }

export const reqProductName = params => { return axios.get(`/sell/seller/product/list`, { params: params }) }



export const reqGetOrder = params => { return axios.get(`/order/getorder`, { params: params }) }

export const reqEditOrder = params => { return axios.get(`/order/edit`, { params: params }) }

export const reqAddOrder = params => { return axios.post(`/sell/buyer/order/save`, params) }


//微信
export const reqGetWechatMenus = params => { return axios.get(`/sell/wechat/menu/list`, { params: params }) }
export const reqEditWechatMenu = params => { return axios.patch(`/sell/wechat/menu`, params) }
export const reqDeleteWechatMenu = params => { return axios.delete(`/sell/wechat/menu`, { params: params }) }
export const reqAddWechatMenu = params => { return axios.post(`/sell/wechat/menu`, params) }
export const reqSyncWechatMenu = params => { return axios.post(`/sell/wechat/menu/synchro`,params) }

//账户管理
export const reqGetAccountList = params => { return axios.get(`/sell/user/account/list`, { params: params }) }
export const reqGetAccountSteted = params => { return axios.get(`/sell/user/account/${params.id}`,{params:params}) }
export default api
