import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'

import BookList from '@/components/book/list'
import BookCategoryList from '@/components/bookcategory/list'

import UserList2 from '@/components/user/userlist'
import UserList from '@/components/user/list'
import OrderList from '@/components/order/list'
import OrderEdit from '@/components/order/edit'
import OrderDetail from '@/components/order/detail'
import OrderAdd from '@/components/order/add'

//商品管理 
import GoodsList from '@/components/goods/list'
import GoodsAdd from '@/components/goods/add'
import GoodsEdit from '@/components/goods/edit'

//异常订单
import ExOrderList from '@/components/order_exception/list'
import ExOrderAdd from '@/components/order_exception/add'
import ExOrderEdit from '@/components/order_exception/edit'
import ExOrderDetail from '@/components/order_exception/detail'

//分销结算
import PlaceSettleList from '@/components/placeSettle/list'
import PlaceSettleEdit from '@/components/placeSettle/edit'
import PlaceSettleSettle from '@/components/placeSettle/settle'

//账户管理
import AccountList from '@/components/account/list'
import AccountStated from '@/components/account/account_stated'
//提现管理
import WithdrawList from '@/components/withdraw/list'
import WithdrawAudit from '@/components/withdraw/audit'
import WithdrawDetail from '@/components/withdraw/detail'
//对账管理
import ReconciliationList from '@/components/reconciliation/list'
import ReconciliationEdit from '@/components/reconciliation/edit'
import ReconciliationDetail from '@/components/reconciliation/detail'
//微信菜单、回复

import WechatMenus from '@/components/wechat/menulist'
import WechatReply from '@/components/wechat/autoreply'



import UserChangePwd from '@/components/user/changepwd'
import UserProfile from '@/components/user/profile'

// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
// mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/dashboard',
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'iconfont icon-home', // 图标样式class
      children: [
        {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true}
      ]
    },
    {
      path: '/user',
      component: Home,
      name: '用户管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/user/userlist', component: UserList2, name: '会员管理', menuShow: true}
      ]
    },
    {
      path: '/goods',
      component: Home,
      name: '商品管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/goods/list', component: GoodsList, name: '商品管理', menuShow: true},
        {path: '/goods/add', component: GoodsAdd, name: '商品新增', menuShow: false},
        {path: '/goods/edit', component: GoodsEdit, name: '商品编辑', menuShow: false}
      ]
    },
    {
      path: '/order',
      component: Home,
      name: '订单管理',
      menuShow: true,
      leaf: true,
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/order/list', component: OrderList, name: '订单列表', menuShow: true},
        {path: '/order/edit', component: OrderEdit, name: '订单编辑', menuShow: false},
        {path: '/order/detail', component: OrderDetail, name: '订单详情', menuShow: false},
        {path: '/order/add', component: OrderAdd, name: '订单新增', menuShow: false}
      ]
    },
    {
      path: '/orderException',
      component: Home,
      name: '订单异常',
      menuShow: true,
      leaf: true,
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/orderException/list', component: ExOrderList, name: '订单异常', menuShow: true},
        {path: '/orderException/edit', component: ExOrderEdit, name: '异常订单编辑', menuShow: false},
        {path: '/orderException/detail', component: ExOrderDetail, name: '异常订单详情', menuShow: false},
        {path: '/orderException/add', component: ExOrderAdd, name: '异常订单新增', menuShow: false}
      ]
    },
    {
      path: '/placeSettle',
      component: Home,
      name: '分销结算',
      menuShow: true,
      leaf: true,
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/placeSettle/list', component: PlaceSettleList, name: '分销结算', menuShow: true},
        {path: '/placeSettle/edit', component: PlaceSettleEdit, name: '结算编辑', menuShow: false},
        {path: '/placeSettle/settle', component: PlaceSettleSettle, name: '结算审核', menuShow: false},
      ]
    },
    {
      path: '/account',
      component: Home,
      name: '账户管理',
      menuShow: true,
      leaf: true,
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/account/list', component: AccountList, name: '账户列表', menuShow: true},
        {path: '/account/account_stated', component: AccountStated, name: '账户明细', menuShow: false}
      ]
    },
    {
      path: '/withdraw',
      component: Home,
      name: '提现管理',
      menuShow: true,
      leaf: true,
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/withdraw/list', component: WithdrawList, name: '提现管理', menuShow: true},
        {path: '/withdraw/audit', component: WithdrawAudit, name: '提现审核', menuShow: false},
        {path: '/withdraw/detail', component: WithdrawDetail, name: '提现详情', menuShow: false}
      ]
    },
    {
      path: '/reconciliation',
      component: Home,
      name: '对账管理',
      menuShow: true,
      leaf: true,
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/reconciliation/list', component: ReconciliationList, name: '对账管理', menuShow: true},
        {path: '/reconciliation/edit', component: ReconciliationEdit, name: '对账处理', menuShow: false},
        {path: '/reconciliation/detail', component: ReconciliationDetail, name: '对账详情', menuShow: false}
      ]
    },
    {
      path: '/wechat',
      component: Home,
      name: '微信管理',
      menuShow: true,
      // leaf: true,
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/wechat/menulist', component: WechatMenus, name: '微信菜单', menuShow: true},
        {path: '/wechat/replylist', component: WechatReply, name: '自动回复设置', menuShow: true}
      ]
    },

/*
    {
      path: '/',
      component: Home,
      name: '用户管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/user/list', component: UserList, name: '用户列表', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '图书管理',
      menuShow: true,
      iconCls: 'iconfont icon-books',
      children: [
        {path: '/book/list', component: BookList, name: '图书列表', menuShow: true},
        {path: '/book/category', component: BookCategoryList, name: '图书分类', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设置',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/user/profile', component: UserProfile, name: '个人信息', menuShow: true},
        {path: '/user/changepwd', component: UserChangePwd, name: '修改密码', menuShow: true}
      ]
    }*/
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    window.sessionStorage.removeItem('access-user')
    next()
  } else {
    let user = JSON.parse(window.sessionStorage.getItem('access-user'))
    if (!user) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

export default router
