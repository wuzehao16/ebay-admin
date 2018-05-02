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
      <!--       <el-form label-width="100px" v-if="!isEdit" @submit.native.prevent>
        <el-form-item label="Ebay原链">
          <el-input v-model="itemId" @keyup.native="handlerSearch" placeholder="ItemId" style="width: 80%;margin-right: 20px;"></el-input>
          <el-button type="primary" @click="onSearch" :disabled="gettingGoods">提取</el-button>
        </el-form-item>
      </el-form> -->
      <template>
        <el-form ref="pro_info" :model="pro_info" :rules="rules" label-width="100px" v-loading="gettingGoods" style="height: 500px;" @submit.native.prevent>
          <!--  -->
          <template v-if="showForm">
            <el-form-item label="商品图片：">
              <el-carousel :interval="41000" arrow="always" height="200px">
                <el-carousel-item v-for="(item, index) in pro_info.productPic.split('@')" :key="item" v-if="pro_info.productPic">
                  <li :style="{background:'url(' + item + ') center no-repeat'}" style="height:100%;list-style-type:none;background:#fff;">
                  </li>
                </el-carousel-item>
              </el-carousel>
            </el-form-item>
            <el-form-item label="商品分类：">
              <el-cascader :options="categories" @change="setProductType" @active-item-change="handleItemChange" :props="props" v-model='goodsType'></el-cascader>
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
import { reqSaveGoods, reqGoodsDetail, reqEbayGoods, reqCategoryList, reqCategoryById } from "../../api";
import debounce from 'lodash/debounce'
export default {
  data() {
    return {
      goodsType: [],
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
      crumbName: "商品编辑",
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
      amount: 100
    };
  },
  methods: {
    setProductType(val) {
      this.pro_info.productType = val[1]
    },
    handleItemChange(val) {
      this.getSub(val)
    },
    getSub(val) {
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
        if (valid && flag && flag2) {
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

              if (this.productId) { //是编辑
                reqGoodsDetail({ productId: this.productId }).then(res => {
                  // this.showForm = true
                  let p = res.data.data
                  // this.pro_info = p
                  //0.商品分类 set
                  reqCategoryById({ productType: p.type }).then(res => {
                    let e = res.data.data
                    this.getSub([e.pid])
                    this.goodsType = [Number.parseInt(e.pid), e.id]
                  })

                  //1.标题 & 介绍 & 图片  set
                  this.pro_info.productNane = p.name
                  this.pro_info.productMemo = p.productMemo
                  // this.pro_info.productPic = p.pic.join("@")

                  for (let m of p.productAttr) {
                    //3.商品规格  set
                    if (m.attrType == '2') {
                      for (let i of this.ebay.localizedAspects) {
                        if (i.name == m.attrEname) {
                          i.cname = m.attrCname
                          i.cvalue = m.attrCvalue
                        }
                      }
                    } else if (m.attrType == '1' && m.attrEname != 'price' && this.ebay.optionAttr) { //2.选择属性  set
                      for (let c of this.ebay.optionAttr_2) {
                        if (c.key == m.attrEname) {
                          c.ckey = m.attrCname
                          for (let j of c.children) {
                            if (j.ckey == m.attrEvalue) {
                              j.cvalue = m.attrCvalue
                            }
                          }
                        }
                      }
                    }
                  }
                  //4.费用（邮费/税费/展示价格/具体价格） set
                  this.exchaneRate = this.ebay.usdRate
                  if (p.carriageFee != 0) {
                    this.feeType.carriage = '不包邮'
                    let _this = this
                    this.$nextTick(function() {
                      console.log('hhaah')
                      setTimeout(function() {
                        console.log('timmmmmm')
                        _this.pro_info.carriageFee = p.carriageFee


                      }, 1000)
                    })
                  }
                  if (p.taxFee != 0) {
                    this.feeType.tax = '不免税'
                    this.$nextTick(function() {
                      this.pro_info.taxFee = p.taxFee
                    })
                  }
                }).catch(err => {})
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
    },
    initCategory() {
      reqCategoryList({ pid: '0' }).then(res => {
        let a = res.data.data
        for (let i of a) {
          i.sub = []
        }
        this.categories = a
      })
    }
  },
  mounted() {
    this.initCategory()
    this.productId = this.$route.params.id
    this.itemId = this.$route.params.itemId
    if (this.productId && this.itemId) {
        this.isEdit = true
      this.onSearch()
    } else {
      this.$message({
        type: 'info',
        message: '该商品信息不全'
      })
    }
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
