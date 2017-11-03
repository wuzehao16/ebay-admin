import * as api from './api'

export const reqGetUserList = params => { return axios.get(`sell/user/list`, { params: params }) }





























//订单列表


export const reqGetOrderList = params => { return axios.get(`/api/seller/order/list`, { params: params }) }

export const reqGetOrder = params => { return axios.get(`/order/getorder`, { params: params }) }

export const reqEditOrder = params => { return axios.get(`/order/edit`, { params: params }) }

export const reqAddOrder = params => { return axios.post(`/api/buyer/order/save`, params) }

//账户管理
export const reqGetAccountList = params => { return axios.get(`/api/user/account/list`, { params: params }) }
export const reqGetAccountSteted = params => { return axios.get(`/api/user/account/${params.id}`,{params:params}) }
export default api
