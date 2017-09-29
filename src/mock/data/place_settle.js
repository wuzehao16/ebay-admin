
import Mock from 'mockjs'
import {Orders} from './order'

const Places = []

for (let o of Orders) {
	let place = Object.assign(Mock.mock({
		fir_level_name: Mock.Random.cname(),
		sec_level_name: Mock.Random.cname(),
		"fir_level_per|0.1": 0, 
		"sec_level_per|0.1": 0, 
		"total_price|0-5000.2":2000,
		"settle_status|0-3": 0,
		settle_time: Mock.Random.date(),
		audit_opinion:  Mock.Random.csentence(10, 30),
		"audit_conclusion|0-2": 0
	}),o)
	Places.push(place)
}

export {Places}
