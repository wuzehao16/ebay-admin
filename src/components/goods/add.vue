<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods/list' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ crumbName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
		<el-form inline class="demo-form-inline" v-if="!isEdit">
		  <el-form-item label="Ebay原链">
		    <el-input v-model="itemId" placeholder="ItemId"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" :loading="gettingGoods" :disabled="gettingGoods" @click="onSearch">提取</el-button>
		  </el-form-item>
		</el-form>
		<template v-if="selected_ebay">
		  <el-form ref="pro_info" :model="pro_info"  label-width="100px" >
			  <el-form-item label="商品名称：">
				<label>{{ ebay.title }}</label>
			    <el-input type="textarea" v-model="pro_info.productNane" placeholder="请翻译商品名称"></el-input>
			  </el-form-item>
			  <el-form-item label="商品价格：">
				<label v-if='ebay.price'>{{ ebay.price.currency + " : " + ebay.price.value }}</label>
			    <el-input type="textarea" v-model="pro_info.productPrice" placeholder="人民币价格￥"></el-input>
			  </el-form-item>
		
			  <el-form-item label="商品图片：">
				  <el-carousel :interval="41000" type="card" height="200px">
				    <el-carousel-item v-for="(item, index) in pro_info.productPic.split('@')" :key="item">
				      <li :style="{background:'url(' + item + ') center no-repeat'}" style="height:100%;list-style-type:none;" >
				  <!--     	<i class="el-icon-close" style="position:absolute;" @click="delPic(index)"></i> -->
				      </li>
				    </el-carousel-item>
				  </el-carousel>
			  </el-form-item>
			  <h2>其它参数：</h2>
			  <template v-for="(item, index) in ebay.localizedAspects">
				  <el-form-item :label="'参数' + (index + 1) + '名称：' ">
					<label>{{ item.name }}</label>	
				    <el-input type="textarea" v-model="else_key[index]" :placeholder="'请翻译参数' + (index + 1) + '名称' "></el-input>
				  </el-form-item> 
				  <el-form-item :label="'参数' + (index + 1) + '内容：' ">
					<label>{{ item.value }}</label>	
				    <el-input type="textarea" v-model="else_value[index]" :placeholder="'请翻译参数' + (index + 1) + '内容' "></el-input>
				  </el-form-item>
			  </template>
			<div style="text-align: center;">
		    	<el-button type="primary" @click="onSave">提审</el-button>
			</div>
		  </el-form>
		</template>
    </el-col>
  </el-row>	
</template>

<script>
import { reqSaveGoods, reqGoodsDetail, reqEbayGoods } from "../../api";
export default {
  data() {
    return {
      gettingGoods: false,
      crumbName: "商品新增",
      else_key: [],
      else_value: [],
      isEdit: false,
      productId: "",
      itemId: "",
      ebay: {},
      selected_ebay: false,
      pro_info: {
        //后台新增不需要openid
        productNane: "",
        userWxOpenid: "",
        productPrice: "",
        ebayItemid: "",
        items: [],
        auditStatus: "0",
        productStatus: "下架",
        productPic: "", //多个图片以@连接
        productIcon: ""
      }
    };
  },
  methods: {
    onSave() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      for (let i in this.else_key) {
        if (!this.isEdit) {
          this.pro_info.items.push({
            attrName: this.else_key[i],
            attrValue: this.else_value[i]
          });
        } else {
          this.pro_info.items[i].attrName = this.else_key[i];
          this.pro_info.items[i].attrValue = this.else_value[i];
        }
      }
      console.log(this.pro_info);
      this.pro_info.productPrice = Number.parseFloat(
        this.pro_info.productPrice
      );
      this.pro_info.ebayItemid = this.itemId;
      this.isEdit ? (this.pro_info.productId = this.productId) : "";
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
    onSearch() {
      const loading2 = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (this.itemId.match(/^[ ]*$/)) {
        this.$message.error("请输入Ebay商品ID");
      } else {
        this.gettingGoods = true;
        let itemId = "v1|" + this.itemId + "|0";
        reqEbayGoods({ itemId })
          .then(res => {
            if (res.data.errors) {
              this.$message.error("找不到该商品！");
            } else if (res.data.itemId) {
              this.ebay = res.data;
              this.selected_ebay = true;
              console.log("ebay", this.ebay);
              this.pro_info.productIcon = this.ebay.image.imageUrl;
              let imgArr = [];
              imgArr.push(this.pro_info.productIcon);
              for (let i of this.ebay.additionalImages) {
                imgArr.push(i.imageUrl);
              }
              this.pro_info.productPic = imgArr.join("@");
            }
            loading2.close();
            this.gettingGoods = false;
          })
          .catch(err => {
            loading2.close();
            this.gettingGoods = false;
          });
      }
    },
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
      this.crumbName = "商品编辑";
      reqGoodsDetail({ productId: this.productId }).then(res => {
        let p = res.data.data;
        console.log("p", p);
        this.pro_info = {
          auditStatus: "0", //待审核
          productStatus: "下架",
          productNane: p.name,
          productPic: p.pic ? p.pic.join("@") : "",
          productPrice: p.price,
					productIcon: p.icon,
					userWxOpenid:userWxOpenid,
          items: p.productAttr
        };
        for (let i in p.productAttr) {
          this.else_key[i] = p.productAttr[i].attrName;
          this.else_value[i] = p.productAttr[i].attrValue;
        }
      });
    }
  }
};
</script>

<style>
.el-table__body tr.current-row > td {
  background: #9eb2c1 !important;
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
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-icon-close {
  display: none;
}
.is-active .el-icon-close {
  display: block;
}
.el-icon-close:hover {
  color: red;
}
</style>
