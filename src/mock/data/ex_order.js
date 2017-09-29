import Mock from 'mockjs'

const ExOrders = []
for (let i = 0; i < 100; i++) {
  ExOrders.push(Mock.mock({
  	ex_id: Mock.Random.id(),
    order_id: Mock.Random.id(),
    goods_name: Mock.Random.ctitle(2, 12),
    "ex_status|0-2": 0,
    "ex_type|0-2": 0,
    "ex_description": Mock.Random.csentence(10, 30),
    create_time: Mock.Random.date(),
    user_name: Mock.Random.cname(),
    tel: /^1[0-9]{10}$/,
    seller_email: Mock.Random.email(),
    seller_tel: /^1[0-9]{10}$/,
    "order_total|100-3000.2": 100,
    "handle_records": [{
	  	des: Mock.Random.csentence(10, 30),
	  	time: Mock.Random.datetime(),
	  	"manner|0-1": 0,
	  	handler: Mock.Random.cname()
	},{
	  	des: Mock.Random.csentence(10, 30),
	  	time: Mock.Random.datetime(),
	  	"manner|0-1": 0,
	  	handler: Mock.Random.cname()		
	}]
  }))
}

export {ExOrders}
