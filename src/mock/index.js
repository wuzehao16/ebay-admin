/**
 * Created by jerry on 2017/4/13.
 */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {LoginUsers, Users} from './data/user'
import {LoginUsersb, Usersb} from './data/userb'
import {Books} from './data/book'
import {Orders} from './data/order'
let _Users = Users
let _Usersb = Usersb
let _Books = Books
let _Orders = Orders

export default {

  init () {
    let mock = new MockAdapter(axios)

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    })

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    })

    // 登录
    mock.onPost('/login').reply(arg => {
      let {username, password} = JSON.parse(arg.data)
      return new Promise((resolve, reject) => {
        let user = null
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u))
              delete user.password
              return true
            }
          })

          if (hasUser) {
            resolve([200, {code: 200, msg: '请求成功', user}])
          } else {
            resolve([200, {code: 500, msg: '账号或密码错误'}])
          }
        }, 1000)
      })
    })

    mock.onPost('/user/profile').reply(function (arg) {
      let {name, email} = JSON.parse(arg.data)
      return new Promise((resolve, reject) => {
        let user = LoginUsers[0]
        user.name = name
        user.email = email
        resolve([200, {code: 200, msg: '请求成功', user}])
      })
    })

    // 获取用户列表
    mock.onGet('/user/list').reply(config => {
      let {name} = config.params
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) === -1) return false
        return true
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockUsers
          }])
        }, 500)
      })
    })

    //获取编辑订单信息_OrderEdit
    mock.onGet('/order/getorder').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            order: _OrderEdit,
            logistics: _Logistics
          }])
        }, 500)
      })
    })

    // 编辑订单提交
    mock.onGet('/order/edit').reply(config => {
      let {
        order_id,
        goods_name,
        goods_amount,
        goods_price,
        order_status,
        order_source,
        ebay_order_no,
        ebay_status,
        user_name,
        user_type,
        tel,
        create_time,
        goods_tax,
        logistics_fees,
        logistics_status,
        pay_type,
        consignee,
        consignee_tel,
        consignee_id,
        consignee_address,
        address_detail       
      } = config.params

      _Orders.some(u => {
        if (u.order_id === order_id) {
          u.goods_name = goods_name,
          u.goods_amount = goods_amount,
          u.goods_price = goods_price,
          u.order_status = order_status,
          u.order_source = order_source,
          u.ebay_order_no = ebay_order_no,
          u.ebay_status = ebay_status,
          u.user_name = user_name,
          u.user_type = user_type,
          u.tel = tel,
          u.create_time = create_time,
          u.goods_tax = goods_tax,
          u.logistics_fees = logistics_fees,
          u.logistics_status = logistics_status,
          u.pay_type = pay_type,
          u.consignee = consignee,
          u.consignee_tel = consignee_tel,
          u.consignee_id =  consignee_id,
          u.consignee_address = consignee_address,
          u.address_detail = address_detail 
          return true
        }
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }])
        }, 500)
      })
    })    

    //新增订单
    mock.onGet('/order/add').reply(config => {
      let {
        order_id,
        goods_name,
        goods_amount,
        goods_price,
        order_status,
        order_source,
        ebay_order_no,
        ebay_status,
        user_name,
        user_type,
        tel,
        create_time,
        goods_tax,
        logistics_fees,
        logistics_status,
        pay_type,
        consignee,
        consignee_tel,
        consignee_id,
        consignee_address,
        address_detail       
      } = config.params

      _Orders.push({
          order_id: Math.random(),
          goods_name: goods_name,
          goods_amount: goods_amount,
          goods_price: goods_price,
          order_status: order_status,
          order_source: order_source,
          ebay_order_no: Math.random(),
          ebay_status: ebay_status,
          user_name: user_name,
          user_type: user_type,
          tel: tel,
          create_time: create_time,
          goods_tax: goods_tax,
          logistics_fees: logistics_fees,
          logistics_status: logistics_status,
          pay_type: pay_type,
          consignee: pay_type,
          consignee_tel: consignee_tel,
          consignee_id:  consignee_id,
          consignee_address: consignee_address,
          address_detail: address_detail 
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }])
        }, 500)
      })
    })      





    // 获取用户列表b
    mock.onGet('/userb/list').reply(config => {
      let {page, page_size, name, tel, wechat_id, usertype} = config.params
      page_size ? page_size : page_size = 10
      let mockUsers = _Usersb.filter(user => {
        if (name && user.name.indexOf(name) === -1) return false
        if (tel && user.tel.indexOf(tel) === -1) return false
        if (wechat_id && user.wechat_id.indexOf(wechat_id) === -1) return false
        if (usertype && user.usertype !== parseInt(usertype) ) return false
        return true
      })
      let total = mockUsers.length
      mockUsers = mockUsers.filter((u, index) => index < page_size * page && index >= page_size * (page - 1))
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockUsers
          }])
        }, 500)
      })
    })


    // 获取订单列表（分页）
    mock.onGet('/order/list').reply(config => {

      let {
        page,
        page_size,
        order_status,
        order_source,
        user_type,
        ebay_status,
        goods_name,
        tel,
        user_name,
        order_id
      } = config.params
      page_size ? page_size : page_size = 10
      let mockOrders = _Orders.filter(order => {
        if (order_source && order.order_source != order_source ) return false
        if (user_type && order.user_type != user_type ) return false
        if (order_status && order.order_status != order_status ) return false
        if (ebay_status && order.ebay_status != ebay_status ) return false

        if (goods_name && order.goods_name.indexOf(goods_name) === -1) return false
        if (tel && order.tel.indexOf(tel) === -1) return false
        if (user_name && order.user_name.indexOf(user_name) === -1) return false
        if (order_id && order.order_id.indexOf(order_id) === -1) return false

        return true
      })
      let total = mockOrders.length
      mockOrders = mockOrders.filter((u, index) => index < page_size * page && index >= page_size * (page - 1))
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            orders: mockOrders
          }])
        }, 500)
      })
    })    

    // 删除用户
    mock.onGet('/user/delete').reply(config => {
      let {id} = config.params
      _Usersb = _Usersb.filter(b => b.id !== id)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }])
        }, 500)
      })
    })


    // 获取用户列表（分页）
    mock.onGet('/book/list').reply(config => {
      let {page, name} = config.params
      let mockBooks = _Books.filter(book => {
        if (name && book.name.indexOf(name) === -1) return false
        return true
      })
      let total = mockBooks.length
      mockBooks = mockBooks.filter((u, index) => index < 10 * page && index >= 10 * (page - 1))
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            books: mockBooks
          }])
        }, 500)
      })
    })



    // 删除用户
    mock.onGet('/book/delete').reply(config => {
      let {id} = config.params
      _Books = _Books.filter(b => b.id !== id)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }])
        }, 500)
      })
    })

    // 编辑图书
    mock.onGet('/book/edit').reply(config => {
      let {id, name, author, description, publishAt} = config.params
      _Books.some(u => {
        if (u.id === id) {
          u.name = name
          u.author = author
          u.description = description
          u.publishAt = publishAt
          return true
        }
      })

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }])
        }, 500)
      })
    })

    // 编辑用户
    mock.onGet('/user/edit').reply(config => {
      let {id, name, tel, sex, usertype, wechat_id} = config.params
      _Usersb.some(u => {
        if (u.id === id) {
          u.name = name
          u.tel = tel
          u.sex = sex
          u.usertype = usertype
          u.wechat_id = wechat_id
          return true
        }
      })

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }])
        }, 500)
      })
    })





    // 批量删除图书
    mock.onGet('/book/batchdelete').reply(config => {
      let {ids} = config.params
      ids = ids.split(',')
      _Books = _Books.filter(u => !ids.includes(u.id))
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }])
        }, 500)
      })
    })

    // 新增图书
    mock.onGet('/book/add').reply(config => {
      let {name, author, description, publishAt} = config.params
      _Books.push({
        name: name,
        author: author,
        description: description,
        publishAt: publishAt
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }])
        }, 500)
      })
    })

    //新增用户
    mock.onGet('/user/add').reply(config => {
      let {name, tel, sex, usertype, wechat_id } = config.params
      _Usersb.push({
        name: name,
        tel: tel,
        sex: sex,
        usertype: usertype,
        wechat_id: wechat_id
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }])
        }, 500)
      })
    })

  

  }

}
