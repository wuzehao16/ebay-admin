<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods/list' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ crumbName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="warp-main1">
      <el-form label-width="100px" v-if="!isEdit" @submit.native.prevent>
        <el-form-item label="Ebay原链">
          <el-input v-model="itemId" @keyup.native="handlerSearch" placeholder="ItemId" style="width: 80%;margin-right: 20px;"></el-input>
          <el-button type="primary" @click="onSearch" :disabled="gettingGoods">提取</el-button>
        </el-form-item>
      </el-form>
      <template>
        <el-form ref="pro_info" :model="pro_info" :rules="rules" label-width="100px" v-loading="gettingGoods" style="height: 500px;" @submit.native.prevent>
          <!--  -->
          <template v-if="showForm">
            <el-form-item label="商品图片：">
              <el-carousel :interval="41000" arrow="always" height="200px">
                <el-carousel-item v-for="(item, index) in pro_info.productPic.split('@')" :key="item" v-if="pro_info.productPic">
                  <li :style="{background:'url(' + item + ') center no-repeat'}" style="height:100%;list-style-type:none;background:#fff;">
                    <!--      <i class="el-icon-close" style="position:absolute;" @click="delPic(index)"></i> -->
                  </li>
                </el-carousel-item>
              </el-carousel>
            </el-form-item>
            <el-form-item label="商品分类：">
              <el-cascader :options="categories" @change="setProductType" @active-item-change="handleItemChange" :props="props"></el-cascader>
              <div class="el-form-item__error" v-if='!pro_info.productType && aspeTip'>请选择商品分类</div>
            </el-form-item>
            <el-form-item label="商品名称：" prop="productNane">
              <label>{{ ebay.title }}</label>
              <el-input type="textarea" v-model="pro_info.productNane" placeholder="请翻译商品名称"></el-input>
            </el-form-item>
            <el-form-item label="汇率：">
              <el-input placeholder="请输入美元USD/人民币CNY" v-model="exchaneRate" readonly>
                <template slot="prepend">美元USD/人民币CNY</template>
              </el-input>
            </el-form-item>
            <el-form-item label="费用：">
              <el-select v-model="feeType.carriage" placeholder="请选择邮费类型">
                <el-option label="包邮" value="包邮"></el-option>
                <el-option label="不包邮" value="不包邮"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="carriageFee" v-if='feeType.carriage == "不包邮"'>
              <el-input type='text' class='fee-input' v-model.number="pro_info.carriageFee" placeholder="请输入邮费">
                <template slot="prepend">邮费（￥）：</template>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="feeType.tax" placeholder="请选择税费类型">
                <el-option label="免税" value="免税"></el-option>
                <el-option label="不免税" value="不免税"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="taxFee" v-if='feeType.tax == "不免税"'>
              <el-input type='text' class='fee-input' v-model.number="pro_info.taxFee" placeholder="请输入税费">
                <template slot="prepend">税费（￥）：</template>
                <template slot="append">元</template>
              </el-input>
              <i>原始税费 = USD x 汇率 x 11.9%</i>
            </el-form-item>
            <el-form-item>
              <el-input type='text' v-model.number="amount" placeholder="请输入统一加价（￥）/元">
                <template slot="prepend">统一加价（￥）/元：</template>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品价格：">
              <template v-if='ebay.price'>
                <label>{{ ebay.price.currency + " : " + ebay.price.value }}</label>
                <el-input :value="getSellPrice(ebay.price.value)" placeholder="人民币价格￥" readonly>
                  <template slot="prepend">￥：</template>
                  <template slot="append">元</template>
                </el-input>
              </template>
              <i>商品价格 = USD x 汇率 + 邮费 + 税费 + 统一加价</i>
            </el-form-item>
            <el-form-item label="具体价格：" v-if="ebay.itemsAttr">
              <el-switch v-model="showTable" active-text="展开" inactive-text="收起">
              </el-switch>
              <table border="1" class="price-attr-table">
                <template v-for="(v, k, i) in ebay.itemsAttr">
                  <tr v-if="i == 0">
                    <th v-for="(m, n, j) in v" v-if="Object.keys(ebay.optionAttr).includes(n) || n == 'price'">{{ n }}</th>
                    <th>商品价格（￥）</th>
                  </tr>
                  <tr class="price-tr" :class="{'hide-table': !showTable, 'show-table': showTable}">
                    <td v-for="(m, n, j) in v" v-if="Object.keys(ebay.optionAttr).includes(n) || n == 'price' || n == 'attrCvalue'">{{ m }}</td>
                  </tr>
                </template>
              </table>
            </el-form-item>
            <template v-for="(v, i) in ebay.optionAttr_2">
              <el-form-item :label="(i == 0 ? '选择属性：' : '')">
                <label>{{ v.key }}</label>
                <el-input type="textarea" v-model="v.ckey" :placeholder=" '请输入' + v.key + '译文' "></el-input>
                <div class="el-form-item__error" v-if='!v.ckey && aspeTip'>请输入{{ v.key }}的译文</div>
              </el-form-item>
              <el-form-item class='op-attr-2'>
                <label>{{ v.key }}的选项的译文：</label>
                <template v-for="(m, j) in v.children">
                  <el-input :key='m.ckey' :placeholder="'请输入' + m.ckey + '的译文'" v-model="m.cvalue">
                    <template slot="prepend">{{ m.ckey }}</template>
                  </el-input>
                  <div class="el-form-item__error" v-if='!m.cvalue && aspeTip'>请输入{{ m.ckey }}的译文</div>
                </template>
              </el-form-item>
            </template>
            <template v-for="(v, i) in ebay.localizedAspects">
              <el-form-item class='op-attr-2' :label="(i == 0 ? '商品规格：' : '' )">
                <label>{{ v.name + ' : ' + v.value}}</label>
                <el-input :placeholder="'请输入' + v.name + '的译文'" v-model="v.cname">
                  <template slot="prepend">{{ v.name }}</template>
                </el-input>
                <div class="spe-wrap">
                  <el-input :value="v.value" type='textarea' autosize disabled>
                  </el-input>
                  <el-input :placeholder="'请输入' + v.value + '的译文'" v-model="v.cvalue" type='textarea' autosize>
                  </el-input>
                </div>
                <div class="el-form-item__error" v-if='!v.cname && aspeTip'>请输入{{ v.name }}的译文</div>
                <div class="el-form-item__error" v-if='!v.cvalue && aspeTip'>请输入{{ v.value }}的译文</div>
              </el-form-item>
            </template>
            <el-form-item label="商品介绍" prop="productMemo">
              <div v-html="ebay.description" class="desc-wrap"></div>
              <el-input type="textarea" v-model="pro_info.productMemo" placeholder="请翻译商品介绍" :rows='8'></el-input>
            </el-form-item>
            <div style="text-align: center;">
              <el-button type="primary" @click="handlerValidate">提审</el-button>
            </div>
          </template>
        </el-form>
      </template>
    </el-col>
  </el-row>
</template>
<script>
import { reqSaveGoods, reqGoodsDetail, reqEbayGoods, reqCategoryList } from "../../api";
import debounce from 'lodash/debounce'
export default {
  data() {
    return {
      categories: [],
      props: {
        value: 'id',
        label: 'name',
        children: 'sub'
      },
      showTable: false,
      exchaneRate: 0,
      testValue: null,
      optionAttr: {
        key: [],
        value: []
      },
      feeType: {
        carriage: '包邮',
        tax: '免税'
      },
      gettingGoods: false,
      crumbName: "商品新增",
      else_key: [],
      else_value: [],
      isEdit: false,
      productId: "",
      itemIds: [],
      itemId: "",
      ebay: {},
      showForm: false,
      selected_ebay: false,
      pro_info: {
        //后台新增不需要openid
        productNane: "",
        userWxOpenid: "",
        productPrice: null,
        ebayItemid: "",
        items: [],
        auditStatus: "0",
        productStatus: "下架",
        productPic: "", //多个图片以@连接
        productIcon: "",
        productMemo: '',
        productUsd: '',
        productCountry: '',
        carriageFee: '',
        taxFee: '',
        productType: ''
      },
      aspeTip: false,
      rules: {
        productNane: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        productPrice: [
          { type: 'number', message: '请输入数字', trigger: 'change' },
          { type: 'number', required: true, message: '请输入价格', trigger: 'change' }
        ],
        carriageFee: [
          { type: 'number', message: '请输入数字', trigger: 'change' },
          { type: 'number', required: true, message: '请输入邮费', trigger: 'change' }
        ],
        taxFee: [
          { type: 'number', message: '请输入数字', trigger: 'change' },
          { type: 'number', required: true, message: '请输入税费', trigger: 'change' }
        ],
        productMemo: [
          { required: true, message: '请输入商品介绍', trigger: 'change' }
        ]
      },
      amount: 10
    };
  },
  methods: {
    setProductType(val) {
      this.pro_info.productType = val[1]
    },
    handleItemChange(val) {
      for (let m of this.categories) {
        if (m.id == val[0] && !m.sub.length) {
          reqCategoryList({ pid: val[0] }).then(res => {
            m.sub = res.data.data
          })
        }
      }
    },
    getSellPrice(usd) {
      if (!this.ebay) {
        return 0
      }
      this.usdRate = Number.parseFloat(this.ebay.usdRate)
      if (!this.pro_info.carriageFee) {
        this.pro_info.carriageFee = 0
      }
      if (!this.pro_info.taxFee) {
        this.pro_info.taxFee = 0
      }
      let CNY = usd * this.usdRate
      let t = (CNY + Number.parseFloat(this.amount) + this.pro_info.taxFee + this.pro_info.carriageFee)
      return new Number(t).toFixed(2)
    },
    handlerSearch(e) {
      if (e.key == 'Enter') {
        this.onSearch()
      }
    },
    handlerValidate() {
      this.aspeTip = true
      this.$refs['pro_info'].validate((valid) => {
        let flag = this.ebay.localizedAspects.every((v, i) => {
          return v.cname && v.cvalue
        })
        let flag2 = true
        if (this.ebay.optionAttr) {
          flag2 = this.ebay.optionAttr_2.every((v, i) => {
            if (!v.ckey) {
              return false
            }
            for (let m of v.children) {
              if (!m.cvalue) {
                return false
              }
            }
            return true
          })
        }
        if (valid && flag && flag2 && this.pro_info.productType) {
          this.onSave()
        } else {
          this.$message.error("还有必填项未填写，请检查！")
          return false
        }
      })
    },
    onSave() {
      //把商品规格单属性放进items
      for (let i of this.ebay.localizedAspects) {
        this.pro_info.items.push({
          attrCname: i.cname,
          attrCvalue: i.cvalue,
          attrEname: i.name,
          attrEvalue: i.value,
          attrType: '2',
          id: this.itemIds[0],
          productId: this.productId
        })
        this.itemIds.splice(0, 1)
      }

      //组合商品：把商品选择属性放进items
      if (this.ebay.optionAttr) {
        let aItems = Object.entries(this.ebay.itemsAttr)
        for (let i of this.ebay.optionAttr_2) {
          for (let j of i.children) {
            let itemid = []
            for (let k of aItems) {
              if (k[1][i.key] == j.ckey) {
                itemid.push(k[0])
              }
            }
            this.pro_info.items.push({
              attrCname: i.ckey,
              attrCvalue: j.cvalue,
              attrEname: i.key,
              attrEvalue: j.ckey, //英文原文
              attrType: '1',
              itemId: itemid.join('@'),
              id: this.itemIds[0],
              productId: this.productId
            })
            this.itemIds.splice(0, 1)
          }
        }
      }
      //组合商品： 组合价格
      if (this.ebay.itemsAttr) {
        let aItems = Object.entries(this.ebay.itemsAttr)
        for (let i of aItems) {
          this.pro_info.items.push({
            attrEname: 'price',
            attrEvalue: i[1].price,
            attrType: '1',
            itemId: i[0],
            attrCname: i[1].stock, //无stock字段，暂用attrCname充当
            attrCvalue: i[1].attrCvalue,
            productId: this.productId,
            id: this.itemIds[0]
          })
          this.itemIds.splice(0, 1)
        }
      }
      this.pro_info.productPrice = this.getSellPrice(this.ebay.price.value)
      this.pro_info.ebayItemid = this.itemId;
      this.isEdit ? (this.pro_info.productId = this.productId) : "";

      this.pro_info.productUsd = Number.parseFloat(this.ebay.price.value)
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      })
      reqSaveGoods(this.pro_info)
        .then(res => {
          loading.close();
          if (res.data.msg == "成功") {
            this.$message({
              type: "success",
              message: "提审成功，系统为您跳转回列表页"
            });
            this.$router.push("/goods/list");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          loading.close();
          this.$message.error("提交失败");
        });
    },
    onSearch: debounce(function() {
      if (this.itemId.match(/^[ ]*$/)) {
        this.$message.error("请输入Ebay商品ID");
      } else {
        this.gettingGoods = true;
        this.showForm = false
        let itemId = this.itemId;
        reqEbayGoods({ itemId })
          .then(res => {
            if (res.data.errors) {
              this.$message.error("找不到该商品！");
            } else if (res.data.itemId) {
              this.showForm = true;
              this.ebay = res.data;
              this.selected_ebay = true;
              this.exchaneRate = this.ebay.usdRate
              this.pro_info.productNane = this.ebay.ctitle
              this.pro_info.productIcon = this.ebay.image.imageUrl
              this.pro_info.productCountry = this.ebay.itemLocation.country
              this.pro_info.productUsd = this.ebay.price.value

              let imgArr = []
              imgArr.push(this.pro_info.productIcon)
              if (this.ebay.additionalImages) {
                for (let i of this.ebay.additionalImages) {
                  imgArr.push(i.imageUrl)
                }
              }
              if (this.ebay.itemsAttr) {
                for (let m of Object.values(this.ebay.itemsAttr)) {
                  imgArr.push(m.imageUrl)
                }
              }
              imgArr = [...new Set(imgArr)]
              if (imgArr.length > 1) {
                this.pro_info.productPic = imgArr.join("@")
              } else {
                this.pro_info.productPic = imgArr.join("")
              }
            }
            this.gettingGoods = false;
          })
          .catch(err => {
            this.gettingGoods = false;
            this.showForm = false;
          });
      }
    }, 600),
    delPic(index) {
      this.selected_ebay.e_pics.splice(index, 1);
    },
    getCNY() {
      if (this.ebay.itemsAttr) {
        for (let i of Object.values(this.ebay.itemsAttr)) {
          i.attrCvalue = this.getSellPrice(i.price)
        }
      }
    }
  },
  mounted() {
    reqCategoryList({ pid: '0' }).then(res => {
      let a = res.data.data
      for (let i of a) {
        i.sub = []
      }
      this.categories = a
    })



    /*    this.ebay = {
          "image": {
            "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg"
          },
          "itemType": 1,
          "description": "夺二万事大吉天夺天下大雨",
          "shortDescription": "All associated Touch ID features will not operate as intended, however all other aspects of the handset remain fully operational. Refurbished Pristine - This is an exceptional product showing no signs of use, it has been fully tested and is in excellent working order.",
          "title": "Apple iPhone 6S - 16GB 32GB 64GB 128GB -Gold/Silver/Grey/Rose- UNLOCKED/SIMFREE",
          "itemLocation": {
            "country": "GB",
            "city": "Barnstaple",
            "postalCode": "EX31 3UD"
          },
          "optionAttr": {
            "Network": [
              "O2 UK",
              "Unlocked",
              "Three UK",
              "EE UK",
              "Vodafone UK",
              "Factory Unlocked"
            ],
            "Grade": [
              "Grade C",
              "Grade D",
              "Pristine",
              "Good",
              "Very Good"
            ],
            "Storage Capacity": [
              "64GB",
              "16GB",
              "128GB",
              "32GB"
            ],
            "Colour": [
              "Space Grey",
              "Silver",
              "Gold",
              "Rose Gold",
              "Grey"
            ]
          },
          "itemId": "202085839828",
          "itemsAttr": {
            "v1|202085839828|502082036724": {
              "price": "329.52",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502105061418": {
              "price": "279.36",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "32GB",
              "stock": 1,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061417": {
              "price": "322.35",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036722": {
              "price": "329.52",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036689": {
              "price": "272.20",
              "Network": "Three UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502105061419": {
              "price": "250.70",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "32GB",
              "stock": 1,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502082036688": {
              "price": "329.52",
              "Network": "Three UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036728": {
              "price": "415.50",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036727": {
              "price": "300.86",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036726": {
              "price": "372.51",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036725": {
              "price": "329.52",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036683": {
              "price": "229.21",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 9,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036681": {
              "price": "372.51",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "128GB",
              "stock": 2,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036680": {
              "price": "358.18",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036687": {
              "price": "257.87",
              "Network": "Three UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036686": {
              "price": "229.21",
              "Network": "Three UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502105061410": {
              "price": "343.85",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502105061379": {
              "price": "243.54",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036719": {
              "price": "308.02",
              "Network": "Three UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502105061412": {
              "price": "308.02",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061411": {
              "price": "372.51",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036718": {
              "price": "401.23",
              "Network": "Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502105061378": {
              "price": "272.20",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 1,
              "Colour": "Gold"
            },
            "v1|202085839828|502105061414": {
              "price": "265.03",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061413": {
              "price": "322.35",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "32GB",
              "stock": 1,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061416": {
              "price": "322.35",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502105061415": {
              "price": "322.35",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502105061407": {
              "price": "343.85",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036735": {
              "price": "329.52",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502105061406": {
              "price": "308.02",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502082036733": {
              "price": "286.53",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502105061409": {
              "price": "372.51",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502082036732": {
              "price": "257.87",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502105061408": {
              "price": "351.01",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502082036699": {
              "price": "272.20",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 1,
              "Colour": "Silver"
            },
            "v1|202085839828|502188325192": {
              "price": "200.55",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036738": {
              "price": "329.52",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036736": {
              "price": "437.05",
              "Network": "Factory Unlocked",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502082036694": {
              "price": "257.87",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036693": {
              "price": "272.26",
              "Network": "Unlocked",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Grade D",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502181827809": {
              "price": "200.55",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 7,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036692": {
              "price": "358.24",
              "Network": "Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Grade D",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036691": {
              "price": "351.01",
              "Network": "EE UK",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502082036698": {
              "price": "372.51",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036731": {
              "price": "272.20",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036730": {
              "price": "200.55",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 1,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036697": {
              "price": "300.86",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036696": {
              "price": "372.51",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036695": {
              "price": "272.20",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036690": {
              "price": "472.88",
              "Network": "Three UK",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Pristine",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502105061401": {
              "price": "329.52",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061400": {
              "price": "300.86",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061403": {
              "price": "243.54",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502252406336": {
              "price": "236.37",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "32GB",
              "stock": 1,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061402": {
              "price": "272.20",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 3,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061405": {
              "price": "279.36",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502105061404": {
              "price": "372.51",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036669": {
              "price": "480.04",
              "Network": "Unlocked",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Pristine",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502082036702": {
              "price": "401.23",
              "Network": "Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502119685335": {
              "price": "315.19",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 1,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502119685336": {
              "price": "243.54",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502082036668": {
              "price": "458.55",
              "Network": "EE UK",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Pristine",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502082036700": {
              "price": "272.20",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 1,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036667": {
              "price": "308.02",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502119685333": {
              "price": "315.19",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502082036666": {
              "price": "329.52",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502119685334": {
              "price": "315.19",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502082036705": {
              "price": "308.02",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502119685332": {
              "price": "315.19",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036660": {
              "price": "272.20",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502155590476": {
              "price": "315.19",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036665": {
              "price": "257.87",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502155590478": {
              "price": "300.86",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502119685339": {
              "price": "315.19",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036664": {
              "price": "214.88",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036663": {
              "price": "243.54",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 6,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502119685337": {
              "price": "315.19",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036662": {
              "price": "343.85",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502119685338": {
              "price": "315.19",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502082036678": {
              "price": "229.21",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036677": {
              "price": "200.55",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036717": {
              "price": "394.06",
              "Network": "EE UK",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502119685340": {
              "price": "358.18",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036670": {
              "price": "401.23",
              "Network": "Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036676": {
              "price": "265.03",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036675": {
              "price": "308.02",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036673": {
              "price": "308.02",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036647": {
              "price": "272.20",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502255258484": {
              "price": "243.54",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "64GB",
              "stock": 1,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036645": {
              "price": "322.41",
              "Network": "O2 UK",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502082036644": {
              "price": "257.87",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036649": {
              "price": "358.18",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036643": {
              "price": "200.55",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 1,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502255258482": {
              "price": "243.54",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "64GB",
              "stock": 1,
              "Colour": "Silver"
            },
            "v1|202085839828|502255258483": {
              "price": "243.54",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036642": {
              "price": "229.21",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036641": {
              "price": "200.55",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036640": {
              "price": "229.21",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502255258481": {
              "price": "308.02",
              "Network": "Three UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "32GB",
              "stock": 1,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036658": {
              "price": "308.08",
              "Network": "Factory Unlocked",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502087822340": {
              "price": "315.19",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036657": {
              "price": "214.88",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036656": {
              "price": "365.40",
              "Network": "Factory Unlocked",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502087822342": {
              "price": "537.36",
              "Network": "O2 UK",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Very Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502082036655": {
              "price": "243.54",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 3,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036659": {
              "price": "214.88",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036650": {
              "price": "537.36",
              "Network": "EE UK",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Very Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502257307757": {
              "price": "257.87",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 2,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036654": {
              "price": "336.74",
              "Network": "Factory Unlocked",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502082036653": {
              "price": "243.54",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 2,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036652": {
              "price": "315.19",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036651": {
              "price": "315.19",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502173597167": {
              "price": "265.03",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502173597168": {
              "price": "272.20",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502173597169": {
              "price": "315.19",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036625": {
              "price": "272.20",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036624": {
              "price": "286.53",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 10,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036623": {
              "price": "286.53",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 1,
              "Colour": "Gold"
            },
            "v1|202085839828|502181827811": {
              "price": "272.20",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036629": {
              "price": "329.52",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036627": {
              "price": "257.87",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502087822334": {
              "price": "265.03",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036626": {
              "price": "257.87",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502087822336": {
              "price": "272.20",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502087822338": {
              "price": "315.19",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036742": {
              "price": "257.87",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036741": {
              "price": "408.39",
              "Network": "Factory Unlocked",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502173597170": {
              "price": "229.21",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036740": {
              "price": "286.53",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 5,
              "Colour": "Silver"
            },
            "v1|202085839828|502105061391": {
              "price": "214.88",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502173597173": {
              "price": "257.87",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 3,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061390": {
              "price": "272.20",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502173597174": {
              "price": "257.87",
              "Network": "Three UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502173597171": {
              "price": "200.55",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502105061393": {
              "price": "286.53",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061392": {
              "price": "343.85",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502173597172": {
              "price": "272.20",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502105061395": {
              "price": "315.19",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061394": {
              "price": "257.87",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "64GB",
              "stock": 3,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502173597175": {
              "price": "250.70",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502105061430": {
              "price": "358.18",
              "Network": "Three UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061397": {
              "price": "329.52",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "64GB",
              "stock": 1,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061396": {
              "price": "358.18",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061432": {
              "price": "200.55",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 4,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061399": {
              "price": "372.51",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061398": {
              "price": "272.20",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061431": {
              "price": "257.87",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061433": {
              "price": "358.18",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502181827810": {
              "price": "236.37",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502246234596": {
              "price": "315.19",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Good",
              "Storage Capacity": "128GB",
              "stock": 1,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036636": {
              "price": "322.41",
              "Network": "EE UK",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502105061429": {
              "price": "229.21",
              "Network": "Three UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502082036635": {
              "price": "229.21",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502105061428": {
              "price": "279.36",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036634": {
              "price": "322.41",
              "Network": "Vodafone UK",
              "imageUrl": "https://i.ebayimg.com/00/s/NjAwWDYwMA\u003d\u003d/z/q8sAAOSw3fZZ6MVG/$_1.JPG?set_id\u003d880000500F",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Grey"
            },
            "v1|202085839828|502082036633": {
              "price": "229.21",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036639": {
              "price": "200.55",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502082036638": {
              "price": "229.21",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Gold"
            },
            "v1|202085839828|502082036632": {
              "price": "257.87",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502082036630": {
              "price": "329.52",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502105061380": {
              "price": "329.52",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061382": {
              "price": "229.21",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061381": {
              "price": "200.55",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061384": {
              "price": "200.55",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061383": {
              "price": "229.21",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061386": {
              "price": "257.87",
              "Network": "Vodafone UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "16GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061385": {
              "price": "229.21",
              "Network": "O2 UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 7,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061421": {
              "price": "365.34",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061388": {
              "price": "358.18",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Very Good",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061387": {
              "price": "243.54",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061420": {
              "price": "250.70",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Grade C",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502105061423": {
              "price": "415.50",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061422": {
              "price": "415.50",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_silver_8.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Silver"
            },
            "v1|202085839828|502105061389": {
              "price": "243.54",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "16GB",
              "stock": 2,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061425": {
              "price": "272.20",
              "Network": "EE UK",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_grey_23.jpg",
              "Grade": "Good",
              "Storage Capacity": "64GB",
              "stock": 0,
              "Colour": "Space Grey"
            },
            "v1|202085839828|502105061424": {
              "price": "415.50",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "128GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502105061427": {
              "price": "365.34",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_rose_gold_25.jpg",
              "Grade": "Pristine",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Rose Gold"
            },
            "v1|202085839828|502105061426": {
              "price": "279.36",
              "Network": "Factory Unlocked",
              "imageUrl": "https://second-handphones.com/media/catalog/product/6/s/6s_gold_1.jpg",
              "Grade": "Good",
              "Storage Capacity": "32GB",
              "stock": 0,
              "Colour": "Gold"
            }
          },
          "price": {
            "convertedFromCurrency": "GBP",
            "currency": "USD",
            "convertedFromValue": "179.95",
            "value": "257.87"
          },
          "ctitle": "苹果iPhone 6S - 16GB 32GB 64GB 128GB -金/银/灰/玫瑰-无锁/无锁。",
          "localizedAspects": [{
              "name": "Brand",
              "cname": "品牌",
              "type": "STRING",
              "value": "Apple",
              "cvalue": "苹果"
            },
            {
              "name": "Features",
              "cname": "特性",
              "type": "STRING",
              "value": "4K Video Recording, Camera, Colour Screen, Email, Fingerprint Sensor, Internet Browsing, MMS (Multimedia Messaging), MP3 Player, Sat Nav, Touch Screen, Video Calling",
              "cvalue": "4K视频录制，摄像头，彩色屏幕，电子邮件，指纹传感器，网络浏览，MMS(多媒体信息)，MP3播放器，卫星导航，触摸屏，视频通话。"
            },
            {
              "name": "Model",
              "cname": "模型",
              "type": "STRING",
              "value": "iPhone 6s",
              "cvalue": "iPhone 6 s"
            },
            {
              "name": "Screen Size",
              "cname": "屏幕大小",
              "type": "STRING",
              "value": "4.7\"",
              "cvalue": "4.7”"
            },
            {
              "name": "Style",
              "cname": "风格",
              "type": "STRING",
              "value": "Smartphone",
              "cvalue": "智能手机"
            },
            {
              "name": "Lock Status",
              "cname": "锁状态",
              "type": "STRING",
              "value": "Factory Unlocked",
              "cvalue": "工厂解锁"
            },
            {
              "name": "Operating System",
              "cname": "操作系统",
              "type": "STRING",
              "value": "iOS",
              "cvalue": "ios"
            },
            {
              "name": "Processor",
              "cname": "处理器",
              "type": "STRING",
              "value": "Dual Core",
              "cvalue": "双核心"
            },
            {
              "name": "Camera Resolution",
              "cname": "相机的分辨率",
              "type": "STRING",
              "value": "12.0MP",
              "cvalue": "12.0像素"
            },
            {
              "name": "RAM",
              "cname": "内存",
              "type": "STRING",
              "value": "2GB",
              "cvalue": "2 gb"
            },
            {
              "name": "Connectivity",
              "cname": "连接",
              "type": "STRING",
              "value": "3G, 4G, Bluetooth, GPRS, GPS, Quad-Band, Tri-Band, USB, WAP, Wi-Fi",
              "cvalue": "3G, 4G，蓝牙，GPRS, GPS，四波段，三波段，USB, WAP, Wi-Fi。"
            },
            {
              "name": "Bundled Items",
              "cname": "绑定的物品",
              "type": "STRING",
              "value": "USB Cable",
              "cvalue": "usb电缆"
            }
          ],
          "optionAttr_2": [{
              "key": "Network",
              "ckey": "网络",
              "children": [{
                  "ckey": "O2 UK",
                  "cvalue": "O2英国"
                },
                {
                  "ckey": "Unlocked",
                  "cvalue": "解锁"
                },
                {
                  "ckey": "Three UK",
                  "cvalue": "三个英国"
                },
                {
                  "ckey": "EE UK",
                  "cvalue": "EE英国"
                },
                {
                  "ckey": "Vodafone UK",
                  "cvalue": "英国沃达丰(Vodafone)"
                },
                {
                  "ckey": "Factory Unlocked",
                  "cvalue": "工厂解锁"
                }
              ]
            },
            {
              "key": "Grade",
              "ckey": "年级",
              "children": [{
                  "ckey": "Grade C",
                  "cvalue": "C级"
                },
                {
                  "ckey": "Grade D",
                  "cvalue": "D级"
                },
                {
                  "ckey": "Pristine",
                  "cvalue": "原始的"
                },
                {
                  "ckey": "Good",
                  "cvalue": "好"
                },
                {
                  "ckey": "Very Good",
                  "cvalue": "很好"
                }
              ]
            },
            {
              "key": "Storage Capacity",
              "ckey": "存储容量",
              "children": [{
                  "ckey": "64GB",
                  "cvalue": "64 gb"
                },
                {
                  "ckey": "16GB",
                  "cvalue": "16 gb"
                },
                {
                  "ckey": "128GB",
                  "cvalue": "128 gb"
                },
                {
                  "ckey": "32GB",
                  "cvalue": "32 gb"
                }
              ]
            },
            {
              "key": "Colour",
              "ckey": "颜色",
              "children": [{
                  "ckey": "Space Grey",
                  "cvalue": "灰色的空间"
                },
                {
                  "ckey": "Silver",
                  "cvalue": "银"
                },
                {
                  "ckey": "Gold",
                  "cvalue": "黄金"
                },
                {
                  "ckey": "Rose Gold",
                  "cvalue": "玫瑰金"
                },
                {
                  "ckey": "Grey",
                  "cvalue": "灰色"
                }
              ]
            }
          ],
          "usdRate": "6.28"
        }
        this.exchaneRate = this.ebay.usdRate*/


  },
  watch: {
    'feeType.carriage': function(a) {
      if (a == '包邮') {
        this.pro_info.carriageFee = 0
      } else {
        this.pro_info.carriageFee = 50
      }
    },
    'feeType.tax': function(a) {
      if (a == '免税') {
        this.pro_info.taxFee = 0
      } else {
        let a = Number.parseFloat(this.ebay.usdRate) * Number.parseFloat(this.ebay.price.value) * 0.119
        this.pro_info.taxFee = Number.parseFloat(a.toFixed(2))
      }
    },
    amount(a) {
      this.getCNY()
    },
    'pro_info.taxFee': function(a) {
      this.getCNY()
    },
    'pro_info.carriageFee': function(a) {
      this.getCNY()
    }
  }
}

</script>
<style lang="scss">
.op-attr-2 {
  .el-input-group__prepend {
    width: 50%;
  }
}

.el-form-item__error {
  position: static;
}

.el-textarea.is-disabled .el-textarea__inner {
  color: #909399!important;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.el-textarea__inner {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.spe-wrap {
  display: flex;
  textarea:disabled {
    padding: 5px 20px;
  }
}

.price-attr-table {
  width: 100%;
  th,
  td {
    text-align: center;
  }
  .price-tr {
    td:last-child {
      background: #f7ba2a;
    }
  }
  th:last-child {
    background: #f7ba2a;
  }
}

.hide-table {
  transition: all .8s ease 1s;
  display: none;
}

.show-table {
  transition: all .8s ease 1s;
  display: table-row;
}

.el-table__body tr.current-row>td {
  background: #9eb2c1 !important;
}

.el-carousel__button {
  background-color: #999;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item li {
  background-size: contain !important;
}

.el-carousel__item:nth-child(2n) {
  background-color: #fff;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #fff;
}

.el-icon-close {
  display: none;
}

.desc-wrap {
  height: 600px;
  overflow: scroll;
  margin-bottom: 10px;
  border: 1px solid #999;
  border-radius: 4px;
}

.is-active .el-icon-close {
  display: block;
}

.el-icon-close:hover {
  color: red;
}

.demo-form-inline {
  margin: 10px 10px;
}

.warp-main1 {
  margin: auto;
  position: absolute;
  top: 50px;
  left: 0;
  bottom: 0;
  right: 0;
}

.fee-input {
  margin: 10px 0;
}

</style>
