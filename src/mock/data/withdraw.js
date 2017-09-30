
import Mock from 'mockjs'

const WithdrawList = []
for (let i = 0; i < 100; i++) {
  WithdrawList.push(Mock.mock({
    withdraw_id: Mock.Random.id(),
    user_name: Mock.Random.cname(),
    tel: /^1[0-9]{10}$/,
    "withdraw_status|0-2": 0,
    "audit_status|0-3": 0,
    "risk_factor|0-2": 0,
    "withdraw_amount|1-20000.2": 100,
    apply_time: Mock.Random.datetime(),
    collected_time: Mock.Random.datetime(),
    "issue_status|0-1": 0,
    "withdrawable_balance|1-33332.2": 3,
    "audit_opinion": Mock.Random.csentence(10, 30)
  }))
}

export {WithdrawList}
