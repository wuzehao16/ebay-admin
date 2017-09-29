
import Mock from 'mockjs'


const Logistics = []
for (let i = 0; i < 10; i++) {
  Logistics.push(Mock.mock({
    id: Mock.Random.guid(),
    description: Mock.Random.csentence(10, 30),
    create_time: Mock.Random.datetime()
  }))
}

const Orders = []
for (let i = 0; i < 100; i++) {
  Orders.push(Mock.mock({
    order_id: Mock.Random.id(),
    goods_name: Mock.Random.ctitle(2, 12),
    "goods_amount|1-10": 3,
    "goods_price|1-1000.1-2": 1,
    "order_status|0-3": 0,
    "order_source|0-1": 0,
    "ebay_order_no": Mock.Random.id(),
    "ebay_status|0-3": 0,
    user_name: Mock.Random.cname(),
    "user_type|0-1": 0,
    tel: /^1[0-9]{10}$/,
    seller_tel: /^1[0-9]{10}$/,
    seller_email: Mock.Random.cname(),
    create_time: Mock.Random.date(),
    goods_tax: 45.32,
    logistics_fees: 64.15,
    logistics_status: 0,
    pay_type: '微信支付',
    consignee: '李大大',
    consignee_tel: '15022113322',
    consignee_id: '445566525228854x',
    consignee_address: ["150000", "150400", "150404"],
    address_detail: '那个屯那个号',
    logistics: Logistics
  }))
}


export {Orders}
