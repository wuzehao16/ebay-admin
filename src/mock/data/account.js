
import Mock from 'mockjs'

const Accounts = []
for (let i = 0; i < 100; i++) {
  Accounts.push(Mock.mock({
    user_id: Mock.Random.id(),
    user_name: Mock.Random.cname(),
    tel: /^1[0-9]{10}$/,
    "earnings_yesterday|1-2000.2": 100,
    "earnings_history|10000-200000.2": 10000,
    "account_balance|10000-200000.2": 10000,
    "check_pending_earnings|1000-20000.2": 10000,
    update_time: Mock.Random.datetime(),
  }))
}

const AccountStated = []
for (let a of Accounts) {
	for ( let i = 0; i < 10; i++ ) {
		AccountStated.push( Object.assign(Mock.mock({
			"account_in|1-111.2": 2,
			"account_out|1-111.2": 2,
			"account_left|1-1211.2": 2,
			des:  Mock.Random.csentence(10, 30),
			trade_time: Mock.Random.datetime(),
			"trade_status|0-2": 0
		}), {
			user_name: a.user_name,
			tel: a.tel,
		}) )
	}
}

export {Accounts, AccountStated}
