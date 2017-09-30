
import Mock from 'mockjs'

const ReconciliationList = []
for (let i = 0; i < 100; i++) {
  ReconciliationList.push(Mock.mock({
    trade_id: Mock.Random.id(),
    user_name: Mock.Random.cname(),
    tel: /^1[0-9]{10}$/,
    "trade_type|0-1": 0,
    "reconc_status|0-2": 0,
    "platform_status|0-2": 0,
    "ebay_status|0-2": 0,
    "platform_amount|1-20000.2": 100,
    "ebay_amount|1-20000.2": 100,
    platform_time: Mock.Random.datetime(),
    ebay_time: Mock.Random.datetime(),
    deal_opinion: Mock.Random.csentence(10, 30)
  }))
}

export {ReconciliationList}
