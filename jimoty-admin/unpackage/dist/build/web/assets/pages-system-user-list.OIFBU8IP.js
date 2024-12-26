import{_ as e,Y as t,n as a,s as i,p as n,N as s,r as l,a as o,c as r,w as d,i as c,b as u,d as m,e as g,f as h,a5 as p,o as f,g as _,j as b,t as y,k as C,l as x,F as k,I as T,m as $,h as S}from"./index-DvwuWHCT.js";import{_ as v}from"./uni-stat-breadcrumb.1_qCubna.js";import{_ as z}from"./download-excel.DZLKoZwF.js";import{_ as D}from"./uni-link.CwV4A0M1.js";import{_ as w,a as j}from"./batch-sms.BqEfF6zU.js";import{_ as I}from"./uni-dateformat.DJj25wzG.js";import{_ as q}from"./uni-pagination.DcoG_qbw.js";import{_ as F}from"./unicloud-db.BruyzEc-.js";import{_ as P}from"./uni-data-checkbox.CVdOplTL.js";import{e as V,f as E}from"./uni-id-users.DFlB41Hw.js";import"./uni-forms.IzwqOl-w.js";import"./uni-forms-item.D9H7wr3d.js";import"./uni-easyinput.CI0qa16L.js";import"./uni-data-select.B1sfxU-t.js";import"./uni-load-more.BsuNNNgF.js";const L=t.database(),U=["username","role.role_name","mobile","email"],A={ascending:"asc",descending:"desc"};const R=e({data:()=>({collectionList:[L.collection("uni-id-users").field("ali_openid,apple_openid,avatar,avatar_file,comment,dcloud_appid,department_id,email,email_confirmed,gender,invite_time,inviter_uid,last_login_date,last_login_ip,mobile,mobile_confirmed,my_invite_code,nickname,role,score,status,username,wx_unionid,qq_unionid,tags").getTemp(),L.collection("uni-id-roles").field("role_id, role_name").getTemp()],query:"",where:"",orderby:"last_login_date desc",orderByFieldName:"",selectedIndexs:[],pageSizeIndex:0,pageSizeOption:[20,50,100,500],tags:{},managerTags:[],queryTagid:"",queryUserId:"",options:{pageSize:20,pageCurrent:1,filterData:{status_localdata:[{text:"正常",value:0,checked:!0},{text:"禁用",value:1},{text:"审核中",value:2},{text:"审核拒绝",value:3}]},...V},imageStyles:{width:64,height:64},exportExcel:{filename:"uni-id-users.xls",type:"xls",fields:{"用户名":"username","手机号码":"mobile","用户状态":"status","邮箱":"email","角色":"role",last_login_date:"last_login_date"}},exportExcelData:[],noAppidWhatShouldIDoLink:"https://uniapp.dcloud.net.cn/uniCloud/uni-id?id=makeup-dcloud-appid",smsCondition:{}}),onLoad(e){this._filter={};const t=e.tagid,a=e.id;if(t){this.queryTagid=t;const e={filterType:"select",filter:[t]};this.filterChange(e,"tags")}if(a){this.queryUserId=a;const e={filterType:"select",filter:[a]};this.filterChange(e,"_id")}},onReady(){this.loadTags(),this.queryTagid||this.queryUserId||this.$refs.udb.loadData()},computed:{tagsData(){const e=[];for(const t in this.tags){const a={value:t,text:this.tags[t]};t===this.queryTagid&&(a.checked=!0),e.push(a)}return e},smsReceiver(){if(this.selectedIndexs.length){let e=this.$refs.udb.dataList;return this.selectedIndexs.map((t=>e[t]._id))}}},methods:{onqueryload(e){for(let t=0;t<e.length;t++){let a=e[t];const i=a.role.map((e=>e.role_name));a.role=i.join("、");const n=a.tags&&a.tags.map((e=>this.tags[e]));a.tags=n,Array.isArray(a.dcloud_appid)&&(a.dcloud_appid=a.dcloud_appid.join("、")),a.last_login_date=this.$formatDate(a.last_login_date)}this.exportExcelData=e},changeSize(e){this.options.pageSize=e,this.options.pageCurrent=1,this.$nextTick((()=>{this.loadData()}))},openTagsPopup(){this.$refs.tagsPopup.open()},closeTagsPopup(){this.$refs.tagsPopup.close()},getWhere(){const e=this.query.trim();if(!e)return"";const t=new RegExp(e,"i");return console.log(JSON.stringify(L.command.or(U.map((e=>({[e]:t})))))),L.command.or(U.map((e=>({[e]:t}))))},search(){const e=this.getWhere();this.where=e,this.$nextTick((()=>{this.loadData()}))},loadData(e=!0){this.$refs.udb.loadData({clear:e})},onPageChanged(e){this.selectedIndexs.length=0,this.$refs.table.clearSelection(),this.$refs.udb.loadData({current:e.current})},navigateTo(e,t){a({url:e,events:{refreshData:()=>{this.loadTags(),this.loadData(t)}}})},selectedItems(){let e=this.$refs.udb.dataList;return this.selectedIndexs.map((t=>e[t]._id))},delTable(){this.$refs.udb.remove(this.selectedItems(),{success:e=>{this.$refs.table.clearSelection()}})},selectionChange(e){this.selectedIndexs=e.detail.index},confirmDelete(e){this.$refs.udb.remove(e,{success:e=>{this.$refs.table.clearSelection()}})},sortChange(e,t){this.orderByFieldName=t,e.order?this.orderby=t+" "+A[e.order]:this.orderby="",this.$refs.table.clearSelection(),this.$nextTick((()=>{this.$refs.udb.loadData()}))},filterChange(e,t){this._filter[t]={type:e.filterType,value:e.filter};let a=E(this._filter,L.command);Object.keys(a).length?this.where=a:this.where="",Object.keys(this._filter).length?this.smsCondition=this._filter:this.smsCondition={},this.$nextTick((()=>{this.$refs.udb.loadData()}))},loadTags(){L.collection("uni-id-tag").limit(500).get().then((e=>{e.result.data.map((e=>{this.$set(this.tags,e.tagid,e.name)}))})).catch((e=>{i({title:"提示",content:e.message,showCancel:!1})}))},managerMultiTag(){const e=this.selectedItems();L.collection("uni-id-users").where({_id:L.command.in(e)}).update({tags:this.managerTags}).then((()=>{n({title:"修改标签成功",duration:2e3}),this.$refs.table.clearSelection(),this.managerTags=[],this.loadData(),this.closeTagsPopup()})).catch((e=>{i({content:e.message||"请求服务失败",showCancel:!1})})).finally((e=>{s()}))}}},[["render",function(e,t,a,i,n,s){const V=l(o("uni-stat-breadcrumb"),v),E=T,L=$,U=l(o("download-excel"),z),A=c,R=l(o("uni-th"),u),M=l(o("uni-tr"),m),N=l(o("uni-td"),g),O=l(o("uni-link"),D),W=l(o("uni-tag"),w),B=l(o("uni-dateformat"),I),G=l(o("uni-table"),h),H=l(o("uni-pagination"),q),J=l(o("unicloud-db"),F),Q=l(o("uni-data-checkbox"),P),Y=l(o("uni-popup"),p),K=l(o("batch-sms"),j);return f(),r(A,{class:"fix-top-window"},{default:d((()=>[_(A,{class:"uni-header"},{default:d((()=>[_(V,{class:"uni-stat-breadcrumb-on-phone"}),_(A,{class:"uni-group"},{default:d((()=>[_(E,{class:"uni-search",type:"text",modelValue:n.query,"onUpdate:modelValue":t[0]||(t[0]=e=>n.query=e),onConfirm:s.search,placeholder:e.$t("common.placeholder.query")},null,8,["modelValue","onConfirm","placeholder"]),_(L,{class:"uni-button hide-on-phone",type:"default",size:"mini",onClick:s.search},{default:d((()=>[b(y(e.$t("common.button.search")),1)])),_:1},8,["onClick"]),_(L,{class:"uni-button",type:"primary",size:"mini",onClick:t[1]||(t[1]=e=>s.navigateTo("./add"))},{default:d((()=>[b(y(e.$t("common.button.add")),1)])),_:1}),_(L,{class:"uni-button",type:"warn",size:"mini",disabled:!n.selectedIndexs.length,onClick:s.delTable},{default:d((()=>[b(y(e.$t("common.button.batchDelete")),1)])),_:1},8,["disabled","onClick"]),_(L,{class:"uni-button",type:"primary",size:"mini",disabled:!n.selectedIndexs.length,onClick:s.openTagsPopup},{default:d((()=>[b(y(e.$t("common.button.tagManager")),1)])),_:1},8,["disabled","onClick"]),_(L,{class:"uni-button",type:"primary",size:"mini",onClick:t[2]||(t[2]=t=>e.$refs.batchSms.open())},{default:d((()=>[b(y(e.$t("common.button.sendSMS")),1)])),_:1}),_(U,{class:"hide-on-phone",fields:n.exportExcel.fields,data:n.exportExcelData,type:n.exportExcel.type,name:n.exportExcel.filename},{default:d((()=>[_(L,{class:"uni-button",type:"primary",size:"mini"},{default:d((()=>[b(y(e.$t("common.button.exportExcel")),1)])),_:1})])),_:1},8,["fields","data","type","name"])])),_:1})])),_:1}),_(A,{class:"uni-container"},{default:d((()=>[_(J,{ref:"udb",collection:n.collectionList,where:n.where,"page-data":"replace",orderby:n.orderby,getcount:!0,"page-size":n.options.pageSize,"page-current":n.options.pageCurrent,options:n.options,loadtime:"manual",onLoad:s.onqueryload},{default:d((({data:a,pagination:i,loading:l,error:o,options:c})=>[_(G,{ref:"table",loading:l,emptyText:o.message||e.$t("common.empty"),border:"",stripe:"",type:"selection",onSelectionChange:s.selectionChange},{default:d((()=>[_(M,null,{default:d((()=>[_(R,{align:"center","filter-type":"search",onFilterChange:t[3]||(t[3]=e=>s.filterChange(e,"username")),sortable:"",onSortChange:t[4]||(t[4]=e=>s.sortChange(e,"username"))},{default:d((()=>[b("用户名")])),_:1}),_(R,{align:"center","filter-type":"search",onFilterChange:t[5]||(t[5]=e=>s.filterChange(e,"nickname")),sortable:"",onSortChange:t[6]||(t[6]=e=>s.sortChange(e,"nickname"))},{default:d((()=>[b("用户昵称")])),_:1}),_(R,{align:"center","filter-type":"search",onFilterChange:t[7]||(t[7]=e=>s.filterChange(e,"mobile")),sortable:"",onSortChange:t[8]||(t[8]=e=>s.sortChange(e,"mobile"))},{default:d((()=>[b("手机号码")])),_:1}),_(R,{align:"center","filter-type":"select","filter-data":c.filterData.status_localdata,onFilterChange:t[9]||(t[9]=e=>s.filterChange(e,"status"))},{default:d((()=>[b("用户状态")])),_:2},1032,["filter-data"]),_(R,{align:"center","filter-type":"search",onFilterChange:t[10]||(t[10]=e=>s.filterChange(e,"email")),sortable:"",onSortChange:t[11]||(t[11]=e=>s.sortChange(e,"email"))},{default:d((()=>[b("邮箱")])),_:1}),_(R,{align:"center"},{default:d((()=>[b("角色")])),_:1}),_(R,{align:"center","filter-type":"select","filter-data":s.tagsData,onFilterChange:t[12]||(t[12]=e=>s.filterChange(e,"tags"))},{default:d((()=>[b("用户标签")])),_:1},8,["filter-data"]),_(R,{align:"center"},{default:d((()=>[b("可登录应用")])),_:1}),_(R,{align:"center","filter-type":"timestamp",onFilterChange:t[13]||(t[13]=e=>s.filterChange(e,"last_login_date")),sortable:"",onSortChange:t[14]||(t[14]=e=>s.sortChange(e,"last_login_date"))},{default:d((()=>[b("最后登录时间")])),_:1}),_(R,{align:"center"},{default:d((()=>[b("操作")])),_:1})])),_:2},1024),(f(!0),C(k,null,x(a,((t,a)=>(f(),r(M,{key:a},{default:d((()=>[_(N,{align:"center"},{default:d((()=>[b(y(t.username),1)])),_:2},1024),_(N,{align:"center"},{default:d((()=>[b(y(t.nickname),1)])),_:2},1024),_(N,{align:"center"},{default:d((()=>[b(y(t.mobile),1)])),_:2},1024),_(N,{align:"center"},{default:d((()=>[b(y(t.status?c.status_valuetotext[t.status]:"正常"),1)])),_:2},1024),_(N,{align:"center"},{default:d((()=>[_(O,{href:"mailto:"+t.email,text:t.email},null,8,["href","text"])])),_:2},1024),_(N,{align:"center"},{default:d((()=>[b(y(t.role),1)])),_:2},1024),_(N,{align:"center"},{default:d((()=>[(f(!0),C(k,null,x(t.tags,((e,a)=>(f(),C(k,{key:a},[t.tags?(f(),r(W,{key:0,type:"primary",inverted:"",size:"small",text:e,style:{margin:"0 5px"}},null,8,["text"])):S("",!0)],64)))),128))])),_:2},1024),_(N,{align:"center"},{default:d((()=>[void 0===t.dcloud_appid?(f(),r(O,{key:0,href:n.noAppidWhatShouldIDoLink},{default:d((()=>[b(" 未绑定可登录应用"),_(A,{class:"uni-icons-help"})])),_:1},8,["href"])):S("",!0),b(" "+y(t.dcloud_appid),1)])),_:2},1024),_(N,{align:"center"},{default:d((()=>[_(B,{threshold:[0,0],date:t.last_login_date},null,8,["date"])])),_:2},1024),_(N,{align:"center"},{default:d((()=>[_(A,{class:"uni-group"},{default:d((()=>[_(L,{onClick:e=>s.navigateTo("./edit?id="+t._id,!1),class:"uni-button",size:"mini",type:"primary"},{default:d((()=>[b(y(e.$t("common.button.edit")),1)])),_:2},1032,["onClick"]),_(L,{onClick:e=>s.confirmDelete(t._id),class:"uni-button",size:"mini",type:"warn"},{default:d((()=>[b(y(e.$t("common.button.delete")),1)])),_:2},1032,["onClick"])])),_:2},1024)])),_:2},1024)])),_:2},1024)))),128))])),_:2},1032,["loading","emptyText","onSelectionChange"]),_(A,{class:"uni-pagination-box"},{default:d((()=>[_(H,{"show-iconn":"","show-page-size":"","page-size":i.size,modelValue:i.current,"onUpdate:modelValue":e=>i.current=e,total:i.count,onChange:s.onPageChanged,onPageSizeChange:s.changeSize},null,8,["page-size","modelValue","onUpdate:modelValue","total","onChange","onPageSizeChange"])])),_:2},1024)])),_:1},8,["collection","where","orderby","page-size","page-current","options","onLoad"])])),_:1}),_(Y,{ref:"tagsPopup",type:"center"},{default:d((()=>[_(A,{class:"tags-manager--x"},{default:d((()=>[_(A,{class:"tags-manager--header mb"},{default:d((()=>[b("管理标签")])),_:1}),_(Q,{ref:"checkbox",modelValue:n.managerTags,"onUpdate:modelValue":t[15]||(t[15]=e=>n.managerTags=e),class:"mb ml",multiple:!0,collection:"uni-id-tag",field:"tagid as value, name as text"},null,8,["modelValue"]),_(A,{class:"uni-group"},{default:d((()=>[_(L,{onClick:s.managerMultiTag,class:"uni-button",type:"primary",style:{"margin-right":"75px"}},{default:d((()=>[b("保存")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1},512),_(K,{ref:"batchSms",toType:"user",receiver:s.smsReceiver,condition:n.smsCondition},null,8,["receiver","condition"])])),_:1})}],["__scopeId","data-v-e46a29ea"]]);export{R as default};
