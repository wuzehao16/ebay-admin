import axios from 'axios'

export const reqGetUserList = params => { return axios.get(`sell/user/list`, { params: params }) }
