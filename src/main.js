// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import '@/assets/iconfont.css'
import router from './router'

Vue.config.productionTip = false
Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  next()
/*  if (to.path.startsWith('/login')) {
    window.sessionStorage.removeItem('access-user')
    next()
  } else {
    let user = JSON.parse(window.sessionStorage.getItem('access-user'))
    if (!user) {
      next({path: '/login'})
    } else {
	  let authArr = JSON.parse(window.sessionStorage.getItem("authArr"))
	  if (authArr && !authArr.includes(to.path)) {
	  	next('/dashboard')
	  }
      next()
    }
  }*/
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
