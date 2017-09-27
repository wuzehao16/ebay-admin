
import Mock from 'mockjs'

/*const OrderEdit = [
  {
    order_id: '1234567890',
    goods_name: '浪凡MARRYME',
    goods_amount: 3,
    goods_price: 500,
    order_status: 0,
    order_source: 0,
    ebay_order_no: '9876543210',
    ebay_status: 0,
    user_name: '苏烈',
    user_type: 0,
    tel: '13855889955',
    create_time: '2017-09-12',
    goods_tax: 45.32,
    logistics_fees: 64.15,
    logistics_status: 0,
    pay_type: '微信支付',
    consignee: '李大大',
    consignee_tel: '15022113322',
    consignee_id: '445566525228854x',
    consignee_address: ["150000", "150400", "150404"],
    address_detail: '那个屯那个号'
  }
]*/

const Logistics = []
for (let i = 0; i < 10; i++) {
  Logistics.push(Mock.mock({
    id: Mock.Random.guid(),
    description: Mock.Random.csentence(10, 30),
    create_time: Mock.Random.datetime()
  }))
}


export {Logistics}
