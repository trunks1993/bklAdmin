webpackJsonp([14],{hGUp:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=i("vMJZ"),l=i("cAgV"),r=i("XbCK"),s={directives:{waves:l.a},components:{PayPage:r.a},data:function(){return{loading:!1,total:null,listQuery:{current:1,size:20,condition:{orderNo:"",status:"",vo:{orderFlag:1,activityName:""},createBy:this.$store.getters.userInfo.id}},orederList:[],rowIndex:0,logistical:{orderId:"",isDelivery:0,expCompany:"",expNo:""},orderDetail:null,order:null,checkstandLogo:"https://www.ijnkj.com/bkl/upload/1/1515129793070.jpg",dialogOrderDetail:!1,dialogPay:!1,dialogLogistical:!1,logisticalRules:{expCompany:[{required:!0,message:"物流公司不能为空",trigger:"change"}],expNo:[{required:!0,message:"请输入订单号",trigger:"blur"}]}}},created:function(){this.getList()},methods:{getList:function(){var e=this;this.loading=!0,Object(a.m)(this.listQuery).then(function(t){var i=t.data;0===i.code&&"success"===i.msg&&(e.orederList=i.datas.records,e.total=i.datas.total,e.loading=!1)}).catch(function(t){e.loading=!1})},handleFilter:function(){this.listQuery.current=1,this.getList()},handleSizeChange:function(e){this.listQuery.size=e,this.getList()},handleCurrentChange:function(e){this.listQuery.current=e,this.getList()},handlerRadioChange:function(){this.getList()},openOrderDetail:function(e){this.dialogOrderDetail=!0,this.orderDetail=e},delivery:function(e,t){this.logistical.orderId=e,this.rowIndex=t,this.dialogLogistical=!0},sendDelivery:function(){var e=this;this.$refs.logistical.validate(function(t){t&&Object(a.w)(e.logistical).then(function(t){var i=t.data;0===i.code&&"success"===i.msg&&(e.orederList.splice(e.rowIndex,1,i.data),e.dialogLogistical=!1,e.$message({type:"success",message:"操纵成功"}))})})},closeDialogLogistical:function(){this.$refs.logistical.resetFields(),this.dialogLogistical=!1}}},o={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("div",{staticClass:"filter-container"},[i("el-input",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:"订单编号"},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.handleFilter(t)}},model:{value:e.listQuery.condition.orderNo,callback:function(t){e.$set(e.listQuery.condition,"orderNo",t)},expression:"listQuery.condition.orderNo"}}),e._v(" "),i("el-input",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:"活动名"},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.handleFilter(t)}},model:{value:e.listQuery.condition.vo.activityName,callback:function(t){e.$set(e.listQuery.condition.vo,"activityName",t)},expression:"listQuery.condition.vo.activityName"}}),e._v(" "),i("el-button",{directives:[{name:"waves",rawName:"v-waves"}],staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.handleFilter}},[e._v("搜索")]),e._v(" "),i("div",{staticStyle:{margin:"10px 0"}},[i("el-radio-group",{staticStyle:{"margin-left":"20px"},on:{change:e.handlerRadioChange},model:{value:e.listQuery.condition.status,callback:function(t){e.$set(e.listQuery.condition,"status",t)},expression:"listQuery.condition.status"}},[i("el-radio",{attrs:{label:""}},[e._v("所有订单")]),e._v(" "),i("el-radio",{attrs:{label:1}},[e._v("等待买家付款")]),e._v(" "),i("el-radio",{attrs:{label:3}},[e._v("等待发货")]),e._v(" "),i("el-radio",{attrs:{label:4}},[e._v("已发货")]),e._v(" "),i("el-radio",{attrs:{label:2}},[e._v("关闭的订单")]),e._v(" "),i("el-radio",{attrs:{label:0}},[e._v("成功的订单")])],1)],1)],1),e._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:e.orederList,"element-loading-text":"给我一点时间",border:"",fit:""}},[i("el-table-column",{attrs:{align:"center",label:"订单编号",prop:"createDate",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.orderNo))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"创建时间",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(e._f("parseTime")(t.row.createDate,"{y}-{m}-{d} {h}:{i}:{s}")))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"订单类型"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(0==t.row.orderType?"活动创建（"+t.row.vo.activityName+"）":"二维码充值"))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"订单状态"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-tag",{class:{blueBack:4===t.row.status},attrs:{type:e._f("getOrderStatus")(t.row.status,2)}},[e._v("\n          "+e._s(e._f("getOrderStatus")(t.row.status,1)))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"二维码数量"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.vo.qrCount))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"二维码单价"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.vo.qrPrice/100))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"微信手续费"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.wxTransfer?t.row.wxTransfer/100:"无"))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"订单金额"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.orderPrice/100))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"操作",width:"250"},scopedSlots:e._u([{key:"default",fn:function(t){return[3===t.row.status?i("el-button",{attrs:{type:"warning",size:"mini"},nativeOn:{click:function(i){e.delivery(t.row.id,t.$index)}}},[e._v("立即发货")]):e._e(),e._v(" "),i("el-button",{attrs:{type:"text"},nativeOn:{click:function(i){e.openOrderDetail(t.row)}}},[e._v("订单详情")]),e._v(" "),1===t.row.orderType&&0===t.row.status||4===t.row.status&&0===t.row.isDelivery?i("el-button",{attrs:{type:"text"},nativeOn:{click:function(i){e.openLogisticalDetail(t.row)}}},[e._v("物流信息")]):e._e()]}}])})],1),e._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:!e.loading,expression:"!loading"}],staticClass:"pagination-container"},[i("el-pagination",{attrs:{background:"","current-page":e.listQuery.current,"page-size":e.listQuery.size,"page-sizes":[10,20,30,50],layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange,"update:currentPage":function(t){e.$set(e.listQuery,"current",t)}}})],1),e._v(" "),e.orderDetail?i("el-dialog",{attrs:{visible:e.dialogOrderDetail},on:{"update:visible":function(t){e.dialogOrderDetail=t}}},[i("div",{attrs:{slot:"title"},slot:"title"},[i("span",[e._v("订单详情")]),e._v(" "),i("el-tag",{class:{blueBack:4===e.orderDetail.status},attrs:{size:"mini",type:e._f("getOrderStatus")(e.orderDetail.status,2)}},[e._v("\n        "+e._s(e._f("getOrderStatus")(e.orderDetail.status,1)))])],1),e._v(" "),0==e.orderDetail.orderType?[i("span",[e._v("二维码收货地址："+e._s(e.orderDetail.vo.deliveryAddress))]),e._v(" "),i("div",{staticClass:"orderDetail-title"},[e._v("活动信息：")]),e._v(" "),i("el-row",[i("el-col",{attrs:{span:8}},[e._v("活动名："+e._s(e.orderDetail.vo.activityName))]),e._v(" "),i("el-col",{attrs:{span:8}},[e._v("总二维码数量："+e._s(e.orderDetail.vo.activityTotalQr)+"张")]),e._v(" "),i("el-col",{attrs:{span:8}},[e._v("红包总金额：¥"+e._s(e.orderDetail.vo.activityTotalMoney/100))]),e._v(" "),i("el-col",{attrs:{span:24}},[e._v("开始时间："+e._s(e._f("parseTime")(e.orderDetail.vo.activityStartDate,"{y}-{m}-{d} {h}:{i}:{s}")))])],1)]:e._e(),e._v(" "),i("div",{staticClass:"orderDetail-title"},[e._v("创建人信息：")]),e._v(" "),i("el-row",[i("el-col",{attrs:{span:8}},[e._v("姓名："+e._s(e.orderDetail.vo.createUserName))]),e._v(" "),i("el-col",{attrs:{span:8}},[e._v("电话："+e._s(e.orderDetail.vo.createUserPhone))])],1),e._v(" "),i("div",{staticClass:"orderDetail-title"},[e._v("订单信息：")]),e._v(" "),i("el-row",[i("el-col",{attrs:{span:12}},[e._v("订单编号："+e._s(e.orderDetail.orderNo))]),e._v(" "),i("el-col",{attrs:{span:12}},[e._v("创建时间："+e._s(e._f("parseTime")(e.orderDetail.createDate,"{y}-{m}-{d} {h}:{i}:{s}")))]),e._v(" "),1!==e.orderDetail.status?i("el-col",{attrs:{span:12}},[e._v(e._s(0===e.orderDetail.status?"成交时间":" 关闭时间")+"："+e._s(e._f("parseTime")(e.orderDetail.updateDate,"{y}-{m}-{d} {h}:{i}:{s}")))]):e._e(),e._v(" "),i("el-col",{attrs:{span:12}},[e._v("订单总金额：¥"+e._s(e.orderDetail.orderPrice/100))])],1)],2):e._e(),e._v(" "),i("el-dialog",{attrs:{title:"发货",visible:e.dialogLogistical,center:""},on:{"update:visible":function(t){e.dialogLogistical=t},close:e.closeDialogLogistical}},[i("el-form",{ref:"logistical",staticStyle:{width:"400px"},attrs:{model:e.logistical,size:"mini",rules:e.logisticalRules,"label-width":"100px"}},[i("el-form-item",{attrs:{label:"需要物流："}},[i("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949","active-value":0,"inactive-value":1},model:{value:e.logistical.isDelivery,callback:function(t){e.$set(e.logistical,"isDelivery",t)},expression:"logistical.isDelivery"}})],1),e._v(" "),0===e.logistical.isDelivery?[i("el-form-item",{attrs:{label:"物流公司：",prop:"expCompany"}},[i("el-input",{attrs:{"auto-complete":"off"},model:{value:e.logistical.expCompany,callback:function(t){e.$set(e.logistical,"expCompany",t)},expression:"logistical.expCompany"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"单号：",prop:"expNo"}},[i("el-input",{attrs:{"auto-complete":"off"},model:{value:e.logistical.expNo,callback:function(t){e.$set(e.logistical,"expNo",t)},expression:"logistical.expNo"}})],1)]:e._e()],2),e._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:e.closeDialogLogistical}},[e._v("取消")]),e._v(" "),i("el-button",{attrs:{type:"primary"},nativeOn:{click:function(t){e.sendDelivery(t)}}},[e._v("确定发货")])],1)],1)],1)},staticRenderFns:[]};var n=i("VU/8")(s,o,!1,function(e){i("tZ01")},"data-v-d56f2250",null);t.default=n.exports},tWWI:function(e,t,i){(e.exports=i("FZ+f")(!1)).push([e.i,"\n.orderDetail-title[data-v-d56f2250] {\n  font-size: 14px;\n  font-weight: bold;\n  border-top: 1px solid #D1D7DC;\n  margin: 10px 0;\n  padding-top: 10px;\n}\n",""])},tZ01:function(e,t,i){var a=i("tWWI");"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);i("rjj0")("676461c1",a,!0)}});