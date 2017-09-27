/**
 * Created by jerry on 2017/4/13.
 */
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

export const reqGetOrderList = params => { return axios.get(`${base}/order/list`, { params: params }) }

export const reqGetOrder = params => { return axios.get(`${base}/order/getorder`, { params: params }) }

export const reqEditOrder = params => { return axios.get(`${base}/order/edit`, { params: params }) }

export const reqAddOrder = params => { return axios.get(`${base}/order/add`, { params: params }) }
