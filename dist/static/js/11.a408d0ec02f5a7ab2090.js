webpackJsonp([11],{ARoL:function(a,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=e("Dd8w"),n=e.n(s),i=e("NYxO"),l=e("r2fM"),o=e("vMJZ"),d={name:"dashboard",data:function(){return{dateType:1,countLoading:!1,totalClickData:null,totalScanData:null,totalShareData:null}},computed:n()({},Object(i.b)(["userInfo"])),mounted:function(){this.initStatistics()},methods:{initStatistics:function(){var a=this;this.countLoading=!0,Object(o.s)(this.userInfo.id,this.dateType).then(function(t){var e=t.data;0===e.code&&"success"===e.msg&&(a.$echarts.init(document.getElementById("myChart")).setOption(Object(l.c)(e.data.totalData)),a.$echarts.init(document.getElementById("clickDate")).setOption(Object(l.a)(e.data.clickData)),a.$echarts.init(document.getElementById("scanDate")).setOption(Object(l.b)(e.data.scanData)),a.totalClickData=e.data.totalClickData,a.totalScanData=e.data.totalScanData,a.totalShareData=e.data.totalShareData,a.countLoading=!1)})},handleChange:function(){this.initStatistics()}}},r={render:function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{directives:[{name:"loading",rawName:"v-loading",value:a.countLoading,expression:"countLoading"}],staticClass:"dashboard-container"},[e("div",{staticClass:"dashboard-total"},[e("el-card",{staticClass:"dashboard-total-card"},[e("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[e("span",[a._v("扫码量")])]),a._v(" "),e("div",{staticClass:"total"},[a.totalScanData?e("span",[a._v("\n          "+a._s(a.totalScanData.total)+"\n        ")]):e("span",[a._v("0")])]),a._v(" "),e("div",{staticClass:"count-container"},[a.totalScanData?[e("span",[a._v("今："+a._s(a.totalScanData.today))]),a._v(" "),e("span",[a._v("昨："+a._s(a.totalScanData.yesterday))]),a._v(" "),e("span",[a._v("周："+a._s(a.totalScanData.week))])]:[e("span",[a._v("今：0")]),a._v(" "),e("span",[a._v("昨：0")]),a._v(" "),e("span",[a._v("周：0")])]],2)]),a._v(" "),e("el-card",{staticClass:"dashboard-total-card"},[e("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[e("span",[a._v("广告分享量")])]),a._v(" "),e("div",{staticClass:"total"},[a.totalShareData?e("span",[a._v("\n          "+a._s(a.totalShareData.total)+"\n        ")]):e("span",[a._v("0")])]),a._v(" "),e("div",{staticClass:"count-container"},[a.totalShareData?[e("span",[a._v("今："+a._s(a.totalShareData.today))]),a._v(" "),e("span",[a._v("昨："+a._s(a.totalShareData.yesterday))]),a._v(" "),e("span",[a._v("周："+a._s(a.totalShareData.week))])]:[e("span",[a._v("今：0")]),a._v(" "),e("span",[a._v("昨：0")]),a._v(" "),e("span",[a._v("周：0")])]],2)]),a._v(" "),e("el-card",{staticClass:"dashboard-total-card"},[e("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[e("span",[a._v("朋友圈点击量")])]),a._v(" "),e("div",{staticClass:"total"},[a.totalClickData?e("span",[a._v("\n          "+a._s(a.totalClickData.total)+"\n        ")]):e("span",[a._v("0")])]),a._v(" "),e("div",{staticClass:"count-container"},[a.totalClickData?[e("span",[a._v("今："+a._s(a.totalClickData.today))]),a._v(" "),e("span",[a._v("昨："+a._s(a.totalClickData.yesterday))]),a._v(" "),e("span",[a._v("周："+a._s(a.totalClickData.week))])]:[e("span",[a._v("今：0")]),a._v(" "),e("span",[a._v("昨：0")]),a._v(" "),e("span",[a._v("周：0")])]],2)]),a._v(" "),e("el-card",{staticClass:"dashboard-total-card"},[e("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[e("span",[a._v("小程序访问量")])]),a._v(" "),e("span",[a._v("暂未开通")])])],1),a._v(" "),e("div",{staticClass:"dashboard-charts"},[e("el-row",[e("el-col",{attrs:{span:12}},[e("div",{style:{width:"100%",height:"300px"},attrs:{id:"scanDate"}})]),a._v(" "),e("el-col",{attrs:{span:12}},[e("div",{style:{width:"100%",height:"300px"},attrs:{id:"clickDate"}})]),a._v(" "),e("el-col",{staticStyle:{"margin-top":"20px"},attrs:{span:24}},[e("span",[a._v("筛选：")]),a._v(" "),e("el-select",{attrs:{size:"mini",placeholder:"请选择"},on:{change:a.handleChange},model:{value:a.dateType,callback:function(t){a.dateType=t},expression:"dateType"}},[e("el-option",{attrs:{label:"最近一周",value:1}}),a._v(" "),e("el-option",{attrs:{label:"最近一月",value:2}}),a._v(" "),e("el-option",{attrs:{label:"最近一年",value:3}})],1),a._v(" "),e("div",{style:{width:"100%",height:"500px"},attrs:{id:"myChart"}})],1)],1)],1)])},staticRenderFns:[]};var c=e("VU/8")(d,r,!1,function(a){e("P0zo")},"data-v-7f6a29d2",null);t.default=c.exports},GYYu:function(a,t,e){(a.exports=e("FZ+f")(!1)).push([a.i,"\n.dashboard-total[data-v-7f6a29d2] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n}\n.dashboard-total-card[data-v-7f6a29d2] {\n    width: 24%;\n}\n.dashboard-total-card .total[data-v-7f6a29d2] {\n      text-align: center;\n}\n.dashboard-total-card .count-container[data-v-7f6a29d2] {\n      margin-top: 20px;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -ms-flex-pack: distribute;\n          justify-content: space-around;\n}\n.dashboard-charts[data-v-7f6a29d2] {\n  margin-top: 40px;\n}\n",""])},P0zo:function(a,t,e){var s=e("GYYu");"string"==typeof s&&(s=[[a.i,s,""]]),s.locals&&(a.exports=s.locals);e("rjj0")("9eb67a24",s,!0)},r2fM:function(a,t,e){"use strict";e.d(t,"c",function(){return s}),e.d(t,"a",function(){return n}),e.d(t,"b",function(){return i});var s=function(a){return{tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},toolbox:{right:"20px",feature:{magicType:{type:["line","bar"]}}},legend:{data:a.dataNames},grid:{left:0,right:0,bottom:0,containLabel:!0},xAxis:[{type:"category",data:a.xAxis}],yAxis:[{type:"value"}],series:[{name:a.values[0].name,type:"bar",data:a.values[0].data},{name:a.values[1].name,type:"bar",data:a.values[1].data},{name:a.values[2].name,type:"bar",data:a.values[2].data}]}},n=function(a){return{title:{text:"朋友圈点击量",subtext:"按时间段",x:"center"},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{orient:"vertical",left:"left",data:a.legendData},series:[{name:"访问来源",type:"pie",radius:"55%",center:["50%","60%"],data:a.data,itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]}},i=function(a){return{title:{text:"扫码量",subtext:"按时间段",x:"center"},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{orient:"vertical",left:"left",data:a.legendData},series:[{name:"访问来源",type:"pie",radius:"55%",center:["50%","60%"],data:a.data,itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]}}}});