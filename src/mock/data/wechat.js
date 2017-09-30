import Mock from 'mockjs'

const WechatMenus = []
for (let i = 0; i < 3; i++) {
  WechatMenus.push(Mock.mock({
  	menu_id: Mock.Random.id(),
  	menu_name: Mock.Random.csentence(4,10),
  	"menu_type|0-1": 0, //0.点击事件 1.URL地址
  	menu_key: Mock.Random.word(),
  	menu_url: Mock.Random.url(),
  	create_time: Mock.Random.datetime(),
  	update_time: Mock.Random.datetime(),
  	children: [{
	  	menu_id: Mock.Random.id(),
	  	menu_name: Mock.Random.csentence(4,10),
	  	"menu_type|0-1": 0, //0.点击事件 1.URL地址
	  	menu_key: Mock.Random.word(),
	  	menu_url: Mock.Random.url(),
	  	create_time: Mock.Random.datetime(),
	  	update_time: Mock.Random.datetime(),  		
	},{
	  	menu_id: Mock.Random.id(),
	  	menu_name: Mock.Random.csentence(4,10),
	  	"menu_type|0-1": 0, //0.点击事件 1.URL地址
	  	menu_key: Mock.Random.word(),
	  	menu_url: Mock.Random.url(),
	  	create_time: Mock.Random.datetime(),
	  	update_time: Mock.Random.datetime(),		
	  },{
	  	menu_id: Mock.Random.id(),
	  	menu_name: Mock.Random.csentence(4,10),
	  	"menu_type|0-1": 0, //0.点击事件 1.URL地址
	  	menu_key: Mock.Random.word(),
	  	menu_url: Mock.Random.url(),
	  	create_time: Mock.Random.datetime(),
	  	update_time: Mock.Random.datetime(),
	}]

  }))
}

export {WechatMenus}