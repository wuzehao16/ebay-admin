import Mock from 'mockjs'
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    email: 'jerry9022@qq.com',
    name: '风车车'
  }
]

const Usersb = []
for (let i = 0; i < 100; i++) {
  Usersb.push(Mock.mock({
    id: Mock.Random.id(),
    name: Mock.Random.cname(),
    tel:/^1[0-9]{10}$/,
    sex: Mock.Random.integer(0,1),
    usertype: Mock.Random.integer(0,1),
    addr: Mock.mock('@county(true)'),
    wechat_id: Mock.Random.first(),
    'age|18-60': 1,
    register_time: Mock.Random.date()
  }))
}

export {LoginUsersb, Usersb}
