/**
 * Created by jerry on 2017/4/13.
 */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {LoginUsers, Users} from './data/user'
import {LoginUsersb, Usersb} from './data/userb'
import {Books} from './data/book'
import {Orders} from './data/order'
import {ExOrders} from './data/ex_order'
import {Places} from './data/place_settle'
import {Accounts, AccountStated} from './data/account'
import {WithdrawList} from './data/withdraw'
import {ReconciliationList} from './data/reconciliation'
import {WechatMenus} from './data/wechat'


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

    //获取微信自定义菜单列表
    mock.onGet('/wechat/menulist').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            menus: WechatMenus
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

    //  编辑分销结算
    mock.onGet('/place_settle/edit').reply(config => {
      let {
        order_id,
        fir_level_name,
        fir_level_per,
        sec_level_name,
        sec_level_per,
      } = config.params

      Places.some(u => {
        if (u.order_id === order_id) {
          u.fir_level_name = fir_level_name
          u.fir_level_per = fir_level_per
          u.sec_level_name = sec_level_name
          u.sec_level_per = sec_level_per
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

    // 审核分销结算place_settle/settle
    mock.onGet('/place_settle/settle').reply(config => {
      let {
        order_id,
        audit_opinion,
        audit_conclusion
      } = config.params

      Places.some(u => {
        if (u.order_id === order_id) {
          u.audit_opinion = audit_opinion
          u.audit_conclusion = audit_conclusion
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


   // 编辑异常订单提交
    mock.onGet('/ex_order/edit').reply(config => {
      let {ex_id, ex_status, handle_records} = config.params
      ExOrders.some(u => {
        if (u.ex_id === ex_id) {
          u.ex_status = ex_status
          u.handle_records = handle_records
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


    //新增异常订单
    mock.onGet('/ex_order/add').reply(config => {
      let ex_order = {
        ex_id: Math.round(Math.random()*100000),
        create_time: "2017-12-12 12:12:12",
        handle_records: []        
      }
      Object.assign(ex_order, config.params)

      ExOrders.push(ex_order)
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

      if (page) {
        mockOrders = mockOrders.filter((u, index) => index < page_size * page && index >= page_size * (page - 1))
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            orders: mockOrders
          }])
        }, 500)
      })
    }) 

    ///place_settle/list  分销结算列表
    mock.onGet('/place_settle/list').reply(config => {
      let {
        page,
        page_size,
        settle_status,
        goods_name,
        user_name,
        order_id
      } = config.params
      page_size ? page_size : page_size = 10
      let mockPlaces = Places.filter(order => {
        if (settle_status && order.settle_status != settle_status ) return false
        if (goods_name && order.goods_name.indexOf(goods_name) === -1) return false
        if (user_name && order.user_name.indexOf(user_name) === -1) return false
        if (order_id && order.order_id.indexOf(order_id) === -1) return false
        return true
      })
      let total = mockPlaces.length
      if (page) {
        mockPlaces = mockPlaces.filter((u, index) => index < page_size * page && index >= page_size * (page - 1))
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            places: mockPlaces
          }])
        }, 500)
      })
    })

    //获取个人账户明细
    mock.onGet('/account/account_stated').reply(config => {
      let {
        page,
        page_size,
        user_name,
        tel,
        trade_status,
        trade_time
      } = config.params
      page_size ? page_size : page_size = 10
      let mockAccountStated = AccountStated.filter(account => {
        if (user_name && account.user_name != user_name ) return false
        if (tel && account.tel != tel ) return false
        if (trade_status && account.trade_status != trade_status ) return false
        if (trade_time) {
          if (new Date(account.trade_time).getTime() < trade_time[0].getTime() )return false
          if (new Date(account.trade_time).getTime() > trade_time[1].getTime() )return false
        }
        return true
      })
      let total = mockAccountStated.length
      if (page) {
        mockAccountStated = mockAccountStated.filter((u, index) => index < page_size * page && index >= page_size * (page - 1))
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            accounts: mockAccountStated
          }])
        }, 500)
      })
    })    

    //账户管理列表money
    mock.onGet('/account/list').reply(config => {
      let {
        page,
        page_size,
        user_name,
        tel,
        little_cpe,
        greater_cpe,
        update_time
      } = config.params
      page_size ? page_size : page_size = 10
      let mockAccounts = Accounts.filter(account => {
        if (tel && account.tel.indexOf(tel) === -1) return false
        if (user_name && account.user_name.indexOf(user_name) === -1) return false
        if (little_cpe && account.check_pending_earnings < little_cpe) return false
        if (greater_cpe && account.check_pending_earnings > greater_cpe) return false
        if (update_time) {
          if (new Date(account.update_time).getTime() < update_time[0].getTime() )return false
          if (new Date(account.update_time).getTime() > update_time[1].getTime() )return false
        }
        return true
      })
      let total = mockAccounts.length
      if (page) {
        mockAccounts = mockAccounts.filter((u, index) => index < page_size * page && index >= page_size * (page - 1))
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            accounts: mockAccounts
          }])
        }, 500)
      })
    })

    //WithdrawList 获取提现列表
    mock.onGet('/withdraw/list').reply(config => {
      let {
        page,
        page_size,
        user_name,
        tel,
        audit_status,
        risk_factor
      } = config.params
      page_size ? page_size : page_size = 10
      let mockWithdrawList = WithdrawList.filter(w => {
        if (tel && w.tel.indexOf(tel) === -1) return false
        if (user_name && w.user_name.indexOf(user_name) === -1) return false
        if (audit_status && w.audit_status  !== Number.parseInt(audit_status)) return false
        if (risk_factor && w.risk_factor  !== Number.parseInt(risk_factor)) return false
        return true
      })
      let total = mockWithdrawList.length
      if (page) {
        mockWithdrawList = mockWithdrawList.filter((u, index) => index < page_size * page && index >= page_size * (page - 1))
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            withdraw_list: mockWithdrawList
          }])
        }, 500)
      })
    })

    //  对账列表
    mock.onGet('/reconciliation/list').reply(config => {
      let {
        page,
        page_size,
        user_name,
        trade_id,
        platform_time,
        ebay_time,
        reconc_status
      } = config.params
      page_size ? page_size : page_size = 10
      let mockReconciliationList = ReconciliationList.filter(w => {
        if (user_name && w.user_name.indexOf(user_name) === -1) return false
        if (trade_id && w.trade_id.indexOf(trade_id) === -1) return false
        if (reconc_status && w.reconc_status  != reconc_status) return false
        if (platform_time) {
          if (new Date(w.platform_time).getTime() < platform_time[0].getTime() ) return false
          if (new Date(w.platform_time).getTime() > platform_time[1].getTime() ) return false
        }        
        if (ebay_time) {
          if (new Date(w.ebay_time).getTime() < ebay_time[0].getTime() ) return false
          if (new Date(w.ebay_time).getTime() > ebay_time[1].getTime() ) return false
        }
        return true
      })
      let total = mockReconciliationList.length
      if (page) {
        mockReconciliationList = mockReconciliationList.filter((u, index) => index < page_size * page && index >= page_size * (page - 1))
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            re_list: mockReconciliationList
          }])
        }, 500)
      })
    })

    // 获取异常订单列表
    mock.onGet('/ex_order/list').reply(config =>{
      let {
        page,
        page_size,
        ex_id,
        order_id,
        goods_name,
        ex_status,
        ex_type,
        ex_description,
        create_time,
        user_name,
        tel,
        seller_email,
        seller_tel,
        handle_records,
        handler    
      } = config.params
     
      page_size ? page_size : page_size = 10
      let mockExOrders = ExOrders.filter(u => {
        if (ex_status && u.ex_status != ex_status) return false
        if (ex_type && u.ex_type != ex_type) return false
        if (order_id && u.order_id.indexOf(order_id) === -1) return false
        if (handler){
          let handlerArr = []
          for (var h of u.handle_records) {
            handlerArr.push(h.handler)
          }
          if (!handlerArr.includes(handler)) return false
        }
        return true
      })
      let total = mockExOrders.length
      mockExOrders = mockExOrders.filter((u, index) => index < page_size * page && index >= page_size * (page - 1))
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            ex_orders: mockExOrders
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

    //  提现审核 
    mock.onGet('/withdraw/audit').reply(config => {
      let {audit_status, audit_opinion, risk_factor, withdraw_id} = config.params
      WithdrawList.some(u => {
        if (u.withdraw_id === withdraw_id) {
          u.audit_status = audit_status
          u.audit_opinion = audit_opinion
          u.risk_factor = risk_factor
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

    //  微信菜单编辑
    mock.onGet('/wechat/menuedit').reply(config => {
      let {menu_id, menu_name, menu_type, menu_url, menu_key } = config.params
      WechatMenus.some(u => {
        if (u.menu_id === menu_id) {
          u.menu_name = menu_name
          u.menu_type = menu_type
          u.menu_url = menu_url
          u.menu_key = menu_key
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

    // 对账处理
    mock.onGet('/reconciliation/edit').reply(config => {
      let {trade_id, deal_opinion} = config.params
      ReconciliationList.some(u => {
        if (u.trade_id === trade_id) {
          u.deal_opinion = deal_opinion
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


    //发放提现 /withdraw/issue
    mock.onGet('/withdraw/issue').reply(config => {
      let {issue_status, withdraw_id} = config.params
      WithdrawList.some(u => {
        if (u.withdraw_id === withdraw_id) {
          u.issue_status = 1 //1为已发放状态
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
