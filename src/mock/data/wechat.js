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

const WechatReply = []
for (let i = 0; i < 3; i++) {
  WechatReply.push(Mock.mock({
  	reply_id: Mock.Random.id(),
  	reply_title: Mock.Random.csentence(4,10),
  	"reply_type|0-1": 0,
  	"reply_default|0-1": 0,
  	reply_key: Mock.Random.word(),
  	reply_url: Mock.Random.url(),
  	reply_img: Mock.Random.image('200x200', '#4A7BF7', 'Hello'),
  	reply_content: Mock.Random.csentence(10,30),
  	create_time: Mock.Random.datetime(),
  	update_time: Mock.Random.datetime()
  	
  }))
}

export {WechatMenus, WechatReply}