webpackJsonp([8],{"3l6I":function(e,t,n){(e.exports=n("FZ+f")(!1)).push([e.i,"\n.trControl[data-v-7c090560] {\n  -webkit-transform: rotate(-90deg);\n          transform: rotate(-90deg);\n  -webkit-transition: .18s;\n  transition: .18s;\n  -webkit-transform-origin: 50% 50%;\n          transform-origin: 50% 50%;\n}\n.is_expanded[data-v-7c090560] {\n  -webkit-transform: rotate(-45deg);\n          transform: rotate(-45deg);\n}\n.menu-icon[data-v-7c090560] {\n  width: 1.3em!important;\n  height: 1.3em!important;\n  vertical-align: -0.3em!important;\n}\n\n",""])},"50sU":function(e,t,n){var i=n("LNWA");"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);n("rjj0")("4513fdcc",i,!0)},LNWA:function(e,t,n){(e.exports=n("FZ+f")(!1)).push([e.i,"\n.radio-icon-group .el-radio-button__inner {\n  border: 0!important;\n  border-radius: 0!important;\n}\n\n",""])},bUp0:function(e,t,n){"use strict";t.b=function(){return Object(i.a)({url:"/menu/getMenuTree",method:"post"})},t.c=function(e){return Object(i.a)({url:"/menu/save",method:"post",data:e})},t.a=function(e){return Object(i.a)({url:"/menu/deleteMenu",method:"post",params:{menuId:e}})};var i=n("vLgD")},jeNv:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("0xDb"),o=n("z8GX"),a=n("bUp0"),r={name:"TreeGrid",props:{menuList:{type:Array},treeLoading:{type:Boolean}},computed:{formatMenuList:function(){return Object(i.a)(this.menuList)}},data:function(){return{dialogFormVisible:!1,treeDialog:!1,iconDialog:!1,dialog_title:"",iconsMap:[],components:[],menu:{id:"",parentId:"",parentTitle:"",title:"",path:"",component:"layout",hidden:!1,icon:"",name:"",redirect:"",createBy:this.$store.getters.userInfo.id,updateBy:this.$store.getters.userInfo.id},parentTemp:{parentTitle:"",parentId:""},iconTemp:"",defaultProps:{children:"children",label:function(e,t){return e.meta.title}},menuRules:{title:[{required:!0,message:"菜单名称不能为空",trigger:"blur"}],path:[{required:!0,message:"路径不能为空",trigger:"blur"}],component:[{required:!0,message:"组件不能为空",trigger:"blur"}],name:[{required:!0,message:"路由命名不能为空",trigger:"blur"}]}}},mounted:function(){var e=o.a.state.iconsMap.map(function(e){return e.default.id.split("-")[1]});this.iconsMap=e},methods:{showTr:function(e){var t=e.row,n=(e.rowIndex,!t._parent||t._parent._expanded&&t._parent._show);return t._show=n,n?"":"display:none;"},toggle:function(e){var t=this.formatMenuList[e];t._expanded=!t._expanded},openDialog:function(e){var t=this;"新建菜单"===e?(this.dialog_title=e,this.dialogFormVisible=!0):(this.dialog_title="编辑菜单",this.dialogFormVisible=!0,setTimeout(function(){t.menu.id=e.meta.id,t.menu.parentTitle=e._parent?e._parent.meta.title:"",t.menu.parentId=e._parent?e._parent.meta.id:"",t.menu.title=e.meta.title,t.menu.path=e.path,t.menu.component=e.component,t.menu.hidden=e.hidden,t.menu.icon=e.meta.icon?e.meta.icon:"",t.menu.redirect=e.redirect,t.menu.name=e.name,t.menu.createBy=e.meta.createBy}))},handleClose:function(){var e=this;e.resetForm(),setTimeout(function(){e.$refs.menu.clearValidate()})},selectParent:function(e,t){this.parentTemp.parentTitle=e.meta.title,this.parentTemp.parentId=e.meta.id},makeSureParent:function(e){e?(this.menu.parentId=this.parentTemp.parentId,this.menu.parentTitle=this.parentTemp.parentTitle,this.treeDialog=!1):this.treeDialog=!1},makeSureIcon:function(e){e?(this.iconTemp&&(this.menu.icon=this.iconTemp),this.iconTemp="",this.iconDialog=!1):(this.iconTemp="",this.iconDialog=!1)},save:function(){var e=this;this.$refs.menu.validate(function(t){t&&Object(a.c)(e.menu).then(function(t){var n=t.data;0===n.code&&"success"===n.msg&&(e.dialogFormVisible=!1,e.$emit("initTree"),e.$notify({title:"成功",message:e.menu.id?"更新成功":"创建成功",type:"success",duration:2e3}))})})},handleDelete:function(e){var t=this;this.$confirm("是否删除菜单?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(a.a)(e).then(function(e){var n=e.data;0===n.code&&"success"===n.msg&&(t.$emit("initTree"),t.$notify({title:"成功",message:"删除成功",type:"success",duration:2e3}))})})},resetForm:function(){this.menu={id:"",parentId:"",parentTitle:"",title:"",path:"",component:"layout",hidden:!1,icon:"",name:"",redirect:"",createBy:this.$store.getters.userInfo.id,updateBy:this.$store.getters.userInfo.id}}}},l={render:function(){var e=this,t=this,n=t.$createElement,i=t._self._c||n;return i("div",[i("div",{staticClass:"filter-container"},[i("el-button",{staticClass:"filter-item",staticStyle:{"margin-left":"10px"},attrs:{plain:"",size:"small",type:"primary",icon:"el-icon-edit"},on:{click:function(e){t.openDialog("新建菜单")}}},[t._v("新建菜单")])],1),t._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.treeLoading,expression:"treeLoading"}],staticStyle:{width:"100%"},attrs:{data:t.formatMenuList,"cell-style":{padding:"6px 0"},"row-style":t.showTr}},[i("el-table-column",{attrs:{label:"图标/名称",width:"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-button",{style:{"margin-left":16*e.row._level+"px"},attrs:{type:"text",size:"mini"},on:{click:function(n){e.row.children&&t.toggle(e.$index)}}},[e.row.children?i("svg-icon",{class:e.row._expanded?"trControl is_expanded":"trControl",attrs:{"icon-class":"BlockArrow"}}):t._e(),t._v(" "),e.row.meta.icon?i("svg-icon",{staticClass:"menu-icon",attrs:{"icon-class":e.row.meta.icon}}):t._e(),t._v("\n          "+t._s(e.row.meta.title)+"\n        ")],1)]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"路径",align:"center",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n        "+t._s(e.row.path)+"\n      ")]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"组件",align:"center",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n        "+t._s(e.row.component)+"\n      ")]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"重定向",align:"center",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n        "+t._s(e.row.redirect)+"\n      ")]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"状态",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-tag",{attrs:{type:e.row.hidden?"danger":"success"}},[t._v(t._s(e.row.hidden?"隐藏":"显示"))])]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"操作",align:"center",width:"260"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-button",{attrs:{size:"mini",plain:""},on:{click:function(n){t.openDialog(e.row)}}},[t._v("编辑")]),t._v(" "),i("el-button",{attrs:{size:"mini",type:"danger",plain:""},on:{click:function(n){t.handleDelete(e.row.meta.id)}}},[t._v("删除")])]}}])})],1),t._v(" "),i("el-dialog",{attrs:{title:t.dialog_title,visible:t.dialogFormVisible},on:{close:t.handleClose,"update:visible":function(e){t.dialogFormVisible=e}}},[i("el-form",{ref:"menu",staticStyle:{width:"400px","margin-left":"50px"},attrs:{"status-icon":"",model:t.menu,rules:t.menuRules,size:"small","label-position":"right","label-width":"90px"}},[i("el-form-item",{attrs:{label:"上级菜单",prop:"parentTitle"}},[i("el-input",{attrs:{readonly:""},on:{focus:function(e){t.treeDialog=!0}},model:{value:t.menu.parentTitle,callback:function(e){t.$set(t.menu,"parentTitle",e)},expression:"menu.parentTitle"}},[i("el-button",{attrs:{slot:"append",icon:"el-icon-close"},on:{click:function(){e.menu.parentTitle="",e.menu.parentId=""}},slot:"append"})],1)],1),t._v(" "),i("el-form-item",{attrs:{label:"菜单名",prop:"title"}},[i("el-input",{model:{value:t.menu.title,callback:function(e){t.$set(t.menu,"title",e)},expression:"menu.title"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"路径",prop:"path"}},[i("el-input",{model:{value:t.menu.path,callback:function(e){t.$set(t.menu,"path",e)},expression:"menu.path"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"图标",prop:"icon"}},[i("el-input",{attrs:{readonly:""},on:{focus:function(e){t.iconDialog=!0}},model:{value:t.menu.icon,callback:function(e){t.$set(t.menu,"icon",e)},expression:"menu.icon"}},[i("svg-icon",{attrs:{slot:"prepend","icon-class":t.menu.icon},slot:"prepend"}),t._v(" "),i("el-button",{attrs:{slot:"append",icon:"el-icon-close"},on:{click:function(){e.menu.icon=""}},slot:"append"})],1)],1),t._v(" "),""!==t.menu.parentId?i("el-form-item",{attrs:{label:"组件",prop:"component"}},[i("el-input",{model:{value:t.menu.component,callback:function(e){t.$set(t.menu,"component",e)},expression:"menu.component"}})],1):i("el-form-item",{attrs:{label:"组件",prop:"component"}},[i("el-input",{attrs:{readonly:""},model:{value:t.menu.component="layout/Layout",callback:function(e){t.$set(t.menu,"component = 'layout/Layout'",e)},expression:"menu.component = 'layout/Layout'"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"重定向",prop:"redirect"}},[i("el-input",{model:{value:t.menu.redirect,callback:function(e){t.$set(t.menu,"redirect",e)},expression:"menu.redirect"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"命名路由",prop:"name"}},[i("el-input",{model:{value:t.menu.name,callback:function(e){t.$set(t.menu,"name",e)},expression:"menu.name"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"可见",prop:"hidden"}},[i("el-switch",{attrs:{"active-color":"#ff4949","inactive-color":"#13ce66"},model:{value:t.menu.hidden,callback:function(e){t.$set(t.menu,"hidden",e)},expression:"menu.hidden"}})],1)],1),t._v(" "),i("div",{attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(e){t.dialogFormVisible=!1}}},[t._v("取 消")]),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:t.save}},[t._v("确 定")])],1)],1),t._v(" "),i("el-dialog",{attrs:{title:"所有菜单",visible:t.treeDialog,width:"300px"},on:{"update:visible":function(e){t.treeDialog=e}}},[i("el-tree",{ref:"tree",attrs:{data:t.menuList,"node-key":"id","highlight-current":"",props:t.defaultProps,"expand-on-click-node":!1},on:{"current-change":t.selectParent}}),t._v(" "),i("div",{attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{size:"mini"},on:{click:function(e){t.makeSureParent(!1)}}},[t._v("取 消")]),t._v(" "),i("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(e){t.makeSureParent(!0)}}},[t._v("确 定")])],1)],1),t._v(" "),i("el-dialog",{attrs:{title:"所有图标",visible:t.iconDialog},on:{"update:visible":function(e){t.iconDialog=e}}},[i("el-radio-group",{staticClass:"radio-icon-group",attrs:{size:"mini"},model:{value:t.iconTemp,callback:function(e){t.iconTemp=e},expression:"iconTemp"}},t._l(t.iconsMap,function(e){return i("el-col",{key:e+Date.now(),attrs:{span:6}},[i("el-radio-button",{attrs:{label:e}},[i("svg-icon",{attrs:{"icon-class":e}}),i("span",{staticStyle:{"margin-left":"5px"}},[t._v(t._s(e))])],1)],1)})),t._v(" "),i("div",{attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{size:"mini"},on:{click:function(e){t.makeSureIcon(!1)}}},[t._v("取 消")]),t._v(" "),i("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(e){t.makeSureIcon(!0)}}},[t._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var s={components:{TreeGrid:n("VU/8")(r,l,!1,function(e){n("yBBN"),n("50sU")},"data-v-7c090560",null).exports},name:"hello",created:function(){this.getMenuList()},data:function(){return{menuList:[],treeLoading:!1}},methods:{getMenuList:function(){var e=this;this.treeLoading=!0,Object(a.b)().then(function(t){var n=t.data;0===n.code&&"success"===n.msg&&(e.menuList=n.data),e.treeLoading=!1}).catch(function(t){e.treeLoading=!1})}}},c={render:function(){var e=this.$createElement;return(this._self._c||e)("tree-grid",{attrs:{"menu-list":this.menuList,treeLoading:this.treeLoading},on:{initTree:this.getMenuList}})},staticRenderFns:[]},u=n("VU/8")(s,c,!1,null,null,null);t.default=u.exports},yBBN:function(e,t,n){var i=n("3l6I");"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);n("rjj0")("9e634058",i,!0)}});