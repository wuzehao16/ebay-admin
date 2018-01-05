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
          <template v-if="showForm">
            <el-form-item label="商品图片：">
              <el-carousel :interval="41000" arrow="always" height="200px">
                <el-carousel-item v-for="(item, index) in pro_info.productPic.split('@')" :key="item">
                  <li :style="{background:'url(' + item + ') center no-repeat'}" style="height:100%;list-style-type:none;background:#fff;">
                    <!--      <i class="el-icon-close" style="position:absolute;" @click="delPic(index)"></i> -->
                  </li>
                </el-carousel-item>
              </el-carousel>
            </el-form-item>
            <el-form-item label="商品名称：" prop="productNane">
              <label>{{ ebay.title }}</label>
              <el-input type="textarea" v-model="pro_info.productNane" placeholder="请翻译商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品价格：" prop="productPrice">
              <label v-if='ebay.price'>{{ ebay.price.currency + " : " + ebay.price.value }}</label>
              <el-input type="textarea" v-model.number="pro_info.productPrice" placeholder="人民币价格￥"></el-input>
            </el-form-item>
            <el-form-item label="组合价格：" v-if="ebay.itemsAttr">
              <el-select v-model="testValue" placeholder="请选择">
                <el-option v-for="(v, k, i) in ebay.itemsAttr" :key="k" :label="'第' + (i + 1) + '种组合价格'" :value="k">
                </el-option>
              </el-select>
              <div v-for="(v, k, i) in ebay.itemsAttr" v-show="k == testValue">
                <p v-for="(item, key, index) in v" v-if="!'imageUrl@stock@attrCvalue'.match(key)">
                  {{ key + ":" + item }}</p>
                <el-input v-model="ebay.itemsAttr[k].attrCvalue" :placeholder="'请输入第' + (i + 1) + '种组合价格'">
                  <template slot="prepend">第{{ i + 1 }}种组合价格（￥）：</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="费用：">
              <el-select v-model="feeType.carriage" placeholder="请选择邮费类型">
                <el-option label="包邮" value="包邮"></el-option>
                <el-option label="不包邮" value="不包邮"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="carriageFee" v-if='feeType.carriage == "不包邮"'>
              <el-input type='text' class='fee-input' v-model.number="pro_info.carriageFee" placeholder="请输入邮费">
                <template slot="prepend">邮费：</template>
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
                <template slot="prepend">税费：</template>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <template v-for="(value, key, index) in ebay.optionAttr">
              <el-form-item :label="(index == 0 ? '选择属性：' : '')">
                <label>{{key}}</label>
                <el-input type="textarea" v-model="optionAttr.key[index]" :placeholder=" '请输入' + key + '译文' "></el-input>
                <div class="el-form-item__error" v-if='!optionAttr.key[index] && aspeTip'>请输入{{ key }}的译文</div>
              </el-form-item>
              <el-form-item>
                <label>{{ key }}的选项的原文：</label>
                <el-input type="textarea" :value="value.join('\r')" disabled :rows="value.length"></el-input>
                <label>{{ key }}的选项的译文：</label>
                <el-input type="textarea" v-model="optionAttr.value[index]" :placeholder=" '请输入' + key + '的选项的译文，选项之间以回车分隔。'" :rows="value.length"></el-input>
                <div class="el-form-item__error" v-if='!optionAttr.value[index] && aspeTip'>请输入{{ key }}的选项的译文</div>
              </el-form-item>
            </template>
            <template v-for="(item, index) in ebay.localizedAspects">
              <el-form-item :label="(index == 0 ? '商品规格：' : '' )" :class="{ 'aspe-wrap2': index == 0}">
                <label>{{ item.name }}</label>
                <el-input type="textarea" v-model="else_key[index]" placeholder="请输入译文"></el-input>
                <div class="el-form-item__error" v-if='!else_key[index] && aspeTip'>请输入{{ item.name }}的译文</div>
              </el-form-item>
              <el-form-item class='aspe-wrap'>
                <label>{{ item.value }}</label>
                <el-input type="textarea" v-model="else_value[index]" placeholder="请输入译文"></el-input>
                <div class="el-form-item__error" v-if='!else_value[index] && aspeTip'>请输入{{ item.value }}的译文</div>
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
import { reqSaveGoods, reqGoodsDetail, reqEbayGoods } from "../../api";
import debounce from 'lodash/debounce'
export default {
  data() {
    return {
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
        carriageFee: null,
        taxFee: null
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
      }
    };
  },
  methods: {
    handlerSearch(e) {
      if (e.key == 'Enter') {
        this.onSearch()
      }
    },
    handlerValidate() {
      this.aspeTip = true
      this.$refs['pro_info'].validate((valid) => {
        let flag = this.ebay.localizedAspects.every((v, i) => {
          return !!this.else_key[i] && !!this.else_value[i]
        })
        let flag2 = true
        if (this.ebay.optionAttr) {
          flag2 = Object.entries(this.ebay.optionAttr).every((v, i) => {
            return !!this.optionAttr.key[i] && !!this.optionAttr.value[i]
          })
        }
        let flag3 = true
        if (this.ebay.itemsAttr) {
          flag3 = Object.entries(this.ebay.itemsAttr).every((v, i) => {
            let str = v[1].attrCvalue
            return str && /^\d+(?:\.\d{1,2})?$/.test(str)
          })
        }
        if (valid && flag && flag2) {
          if (flag3) {
            this.onSave()
          } else {
            this.$message.error("请填写全部的组合价格（只能为最多两位小数的数字）")
            return false
          }
        } else {
          this.$message.error("还有必填项未填写，请检查！")
          return false
        }
      })
    },
    onSave() {
      //把商品规格单属性放进items
      for (let i in this.else_key) {
        this.pro_info.items.push({
          attrCname: this.else_key[i],
          attrCvalue: this.else_value[i],
          attrType: '2',
          id: this.itemIds[0],
          productId: this.productId
        })
        this.itemIds.splice(0, 1)
      }
      //组合商品：把商品选择属性放进items
      if (this.ebay.optionAttr) {
        let aItems = Object.entries(this.ebay.itemsAttr)
        for (let [i, item] of new Map(Object.entries(this.ebay.optionAttr).map((item, i) => [i, item]))) {
          let tempCvalue = this.optionAttr.value[i].split(/[\r\n]/g)
          for (let [j, elem] of item[1].entries()) {
            let itemId = []
            for (let i of aItems) {
              if (i[1][item[0]] == elem) {
                itemId.push(i[0])
              }
            }
            this.pro_info.items.push({
              attrCname: this.optionAttr.key[i],
              attrCvalue: tempCvalue[j] || '',
              attrEname: item[0],
              attrEvalue: elem, //英文原文
              attrType: '1',
              itemId: itemId.join('@'), //以@连接
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
            attrCname: i[1].stock, //无stock字段，暂用attrCvalue充当
            attrCvalue: i[1].attrCvalue,
            productId: this.productId,
            id: this.itemIds[0]
          })
          this.itemIds.splice(0, 1)
        }
      }

      if (this.feeType.carriage == '包邮') {
        this.pro_info.carriageFee = null
      }
      if (this.feeType.tax == '免税') {
        this.pro_info.taxFee = null
      }
      this.pro_info.productPrice = Number.parseFloat(
        this.pro_info.productPrice
      );
      this.pro_info.ebayItemid = this.itemId;
      this.isEdit ? (this.pro_info.productId = this.productId) : "";

      this.pro_info.productUsd = Number.parseFloat(this.pro_info.productUsd)
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
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

              this.pro_info.productIcon = this.ebay.image.imageUrl
              this.pro_info.productCountry = this.ebay.itemLocation.country
              this.pro_info.productUsd = this.ebay.price.value

              let imgArr = []
              imgArr.push(this.pro_info.productIcon)
              if (this.ebay.additionalImages) {
                for (let i of this.ebay.additionalImages) {
                  imgArr.push(i.imageUrl)
                }
                this.pro_info.productPic = imgArr.join("@")
              } else {
                this.pro_info.productPic = imgArr.join("")
              }
              //set 组合价格
              try {
                if (this.ebay.itemsAttr) {
                  let arr = Object.keys(this.ebay.itemsAttr)
                  for (let v of this.pro_info.productAttr_bak) {
                    if (v.itemId && arr.includes(v.itemId)) {
                      this.ebay.itemsAttr[v.itemId].attrCvalue = v.attrCvalue
                    }
                  }
                }
              } catch (error) {
                console.log(error)
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
    }
  },
  mounted() {
    this.productId = this.$route.params.productId;
    if (this.productId) {

      this.itemId = this.$route.params.ebayItemid;
      let userWxOpenid = this.$route.params.userWxOpenid;
      this.onSearch();
      this.isEdit = true;
      // this.showForm = true;
      this.crumbName = "商品编辑";
      reqGoodsDetail({ productId: this.productId }).then(res => {
        let p = res.data.data;

        this.pro_info = {
          auditStatus: "0", //待审核
          productStatus: "下架",
          productNane: p.name,
          productPic: p.pic ? p.pic.join("@") : "",
          productPrice: p.price,
          productIcon: p.icon,
          userWxOpenid: userWxOpenid,
          items: [],
          productMemo: p.productMemo,
          productUsd: p.productUsd,
          carriageFee: p.carriageFee,
          taxFee: p.taxFee,
          productAttr_bak: p.productAttr || []
        }

        if (p.carriageFee) {
          this.feeType.carriage = '不包邮'
        }
        if (p.taxFee) {
          this.feeType.tax = '不免税'
        }


        let j = 0
        for (let [i, item] of new Map(p.productAttr.map((item, i) => [i, item]))) {
          this.itemIds.push(item.id)
          if (item.attrType == '2') {
            this.else_key.push(item.attrCname)
            this.else_value.push(item.attrCvalue)
          } else if (item.attrType == '1') {
            if (this.optionAttr.key[j] && this.optionAttr.key[j] != item.attrCname) {
              j++
            }
            if (!this.optionAttr.key[j]) {
              this.optionAttr.key[j] = item.attrCname
              this.optionAttr.value[j] = item.attrCvalue
            } else if (this.optionAttr.key[j] == item.attrCname) {
              this.optionAttr.value[j] += '\n' + item.attrCvalue
            }
          }
        }


      });
    }
  },
  watch: {

  }
}

</script>
<style>
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

.aspe-wrap2 .el-form-item__content {
  /*border-top: 1px dashed #999;*/
}

.aspe-wrap .el-form-item__content {
  /*  border-bottom: 1px dashed #999;
  padding-bottom: 30px;*/
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
