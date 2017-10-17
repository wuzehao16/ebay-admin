import Mock from 'mockjs'

const EbayGoods = []
for (let i = 0; i < 100; i++) {
    EbayGoods.push(Mock.mock({
        item_id: Mock.Random.id(),
        "data_model|0-2": 0,
        e_goods_name: Mock.Random.title(),
        "e_usd_price|200-3000.2": 2000,
        e_features: Mock.Random.title(),
        e_origin: Mock.Random.first(),
        e_pics: [
            Mock.Random.image('400x200', '#4A7BF7', 'Hello1'),
            Mock.Random.image('200x400', '#50B347', 'Hello2'),
            Mock.Random.image('200x200', '#894FC4', 'Hello3'),
            Mock.Random.image('200x200', '#4A7BF7', 'Hello4'),
            Mock.Random.image('200x200', '#894FC4', 'Hello5')
        ],
        e_des: [
            {key: "condition", value: Mock.Random.title()},
            {key: "type", value: Mock.Random.title()}
        ]

    }))
}


const Goods = []
for (let i = 0; i < 100; i++) {
  Goods.push(Mock.mock({
    id: Mock.Random.id(),
    item_id: Mock.Random.id(),
    goods_name: Mock.Random.csentence(10,20),
    "goods_status|0-3": 0,
    translator: Mock.Random.cname(),
    "audit_status|0-3": 0,
    translate_time: Mock.Random.date(),
    audit_time: Mock.Random.date(),
    "goods_price|100-3000.2": 343.22,
    goods_features: Mock.Random.title(),
    goods_origin: Mock.Random.first(),
    goods_pics: [],
    goods_des: []
  }))
}

export {Goods, EbayGoods}
