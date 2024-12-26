import{_ as e,Y as t,n as a,r as n,a as l,c as s,w as i,i as o,b as r,d,e as u,f as c,o as h,g,j as f,k as p,l as m,F as b,I as y,m as _,t as C}from"./index-DvwuWHCT.js";import{_ as x}from"./download-excel.DZLKoZwF.js";import{_ as I}from"./uni-dateformat.DJj25wzG.js";import{_ as S}from"./uni-pagination.DcoG_qbw.js";import{_ as k}from"./unicloud-db.BruyzEc-.js";import{e as D,f as $}from"./jimoty-chat-message.BmZ1O05K.js";const w=t.database(),z=[],j={ascending:"asc",descending:"desc"};const T=e({data:()=>({collectionList:"jimoty-chat-message",query:"",where:"",orderby:"",orderByFieldName:"",selectedIndexs:[],options:{pageSize:20,pageCurrent:1,filterData:{},...D},imageStyles:{width:64,height:64},exportExcel:{filename:"jimoty-chat-message.xls",type:"xls",fields:{"消息框id":"chatBoxId","消息发送方":"userId","消息接收方":"friendId","是否已读":"status","消息内容":"message","消息类型":"type","是否删除":"delete","消息创建时间":"time"}},exportExcelData:[]}),onLoad(){this._filter={}},onReady(){this.$refs.udb.loadData()},methods:{onqueryload(e){this.exportExcelData=e},getWhere(){const e=this.query.trim();if(!e)return"";const t=new RegExp(e,"i");return z.map((e=>t+".test("+e+")")).join(" || ")},search(){const e=this.getWhere();this.where=e,this.$nextTick((()=>{this.loadData()}))},loadData(e=!0){this.$refs.udb.loadData({clear:e})},onPageChanged(e){this.selectedIndexs.length=0,this.$refs.table.clearSelection(),this.$refs.udb.loadData({current:e.current})},navigateTo(e,t){a({url:e,events:{refreshData:()=>{this.loadData(t)}}})},selectedItems(){var e=this.$refs.udb.dataList;return this.selectedIndexs.map((t=>e[t]._id))},delTable(){this.$refs.udb.remove(this.selectedItems(),{success:e=>{this.$refs.table.clearSelection()}})},selectionChange(e){this.selectedIndexs=e.detail.index},confirmDelete(e){this.$refs.udb.remove(e,{success:e=>{this.$refs.table.clearSelection()}})},sortChange(e,t){this.orderByFieldName=t,e.order?this.orderby=t+" "+j[e.order]:this.orderby="",this.$refs.table.clearSelection(),this.$nextTick((()=>{this.$refs.udb.loadData()}))},filterChange(e,t){this._filter[t]={type:e.filterType,value:e.filter};let a=$(this._filter,w.command);Object.keys(a).length?this.where=a:this.where="",this.$nextTick((()=>{this.$refs.udb.loadData()}))}}},[["render",function(e,t,a,D,$,w){const z=o,j=y,T=_,E=n(l("download-excel"),x),v=n(l("uni-th"),r),F=n(l("uni-tr"),d),V=n(l("uni-td"),u),q=n(l("uni-dateformat"),I),B=n(l("uni-table"),c),L=n(l("uni-pagination"),S),R=n(l("unicloud-db"),k);return h(),s(z,null,{default:i((()=>[g(z,{class:"uni-header"},{default:i((()=>[g(z,{class:"uni-group"},{default:i((()=>[g(z,{class:"uni-title"}),g(z,{class:"uni-sub-title"})])),_:1}),g(z,{class:"uni-group"},{default:i((()=>[g(j,{class:"uni-search",type:"text",modelValue:$.query,"onUpdate:modelValue":t[0]||(t[0]=e=>$.query=e),onConfirm:w.search,placeholder:"请输入搜索内容"},null,8,["modelValue","onConfirm"]),g(T,{class:"uni-button",type:"default",size:"mini",onClick:w.search},{default:i((()=>[f("搜索")])),_:1},8,["onClick"]),g(T,{class:"uni-button",type:"default",size:"mini",onClick:t[1]||(t[1]=e=>w.navigateTo("./add"))},{default:i((()=>[f("新增")])),_:1}),g(T,{class:"uni-button",type:"default",size:"mini",disabled:!$.selectedIndexs.length,onClick:w.delTable},{default:i((()=>[f("批量删除")])),_:1},8,["disabled","onClick"]),g(E,{class:"hide-on-phone",fields:$.exportExcel.fields,data:$.exportExcelData,type:$.exportExcel.type,name:$.exportExcel.filename},{default:i((()=>[g(T,{class:"uni-button",type:"primary",size:"mini"},{default:i((()=>[f("导出 Excel")])),_:1})])),_:1},8,["fields","data","type","name"])])),_:1})])),_:1}),g(z,{class:"uni-container"},{default:i((()=>[g(R,{ref:"udb",collection:$.collectionList,field:"chatBoxId,userId,friendId,status,message,type,delete,time",where:$.where,"page-data":"replace",orderby:$.orderby,getcount:!0,"page-size":$.options.pageSize,"page-current":$.options.pageCurrent,options:$.options,loadtime:"manual",onLoad:w.onqueryload},{default:i((({data:e,pagination:a,loading:n,error:l,options:o})=>[g(B,{ref:"table",loading:n,emptyText:l.message||"没有更多数据",border:"",stripe:"",type:"selection",onSelectionChange:w.selectionChange},{default:i((()=>[g(F,null,{default:i((()=>[g(v,{align:"center",sortable:"",onSortChange:t[2]||(t[2]=e=>w.sortChange(e,"chatBoxId"))},{default:i((()=>[f("消息框id")])),_:1}),g(v,{align:"center",sortable:"",onSortChange:t[3]||(t[3]=e=>w.sortChange(e,"userId"))},{default:i((()=>[f("消息发送方")])),_:1}),g(v,{align:"center",sortable:"",onSortChange:t[4]||(t[4]=e=>w.sortChange(e,"friendId"))},{default:i((()=>[f("消息接收方")])),_:1}),g(v,{align:"center",sortable:"",onSortChange:t[5]||(t[5]=e=>w.sortChange(e,"status"))},{default:i((()=>[f("是否已读")])),_:1}),g(v,{align:"center","filter-type":"search",onFilterChange:t[6]||(t[6]=e=>w.filterChange(e,"message")),sortable:"",onSortChange:t[7]||(t[7]=e=>w.sortChange(e,"message"))},{default:i((()=>[f("消息内容")])),_:1}),g(v,{align:"center","filter-type":"range",onFilterChange:t[8]||(t[8]=e=>w.filterChange(e,"type")),sortable:"",onSortChange:t[9]||(t[9]=e=>w.sortChange(e,"type"))},{default:i((()=>[f("消息类型")])),_:1}),g(v,{align:"center",sortable:"",onSortChange:t[10]||(t[10]=e=>w.sortChange(e,"delete"))},{default:i((()=>[f("是否删除")])),_:1}),g(v,{align:"center","filter-type":"timestamp",onFilterChange:t[11]||(t[11]=e=>w.filterChange(e,"time")),sortable:"",onSortChange:t[12]||(t[12]=e=>w.sortChange(e,"time"))},{default:i((()=>[f("消息创建时间")])),_:1}),g(v,{align:"center"},{default:i((()=>[f("操作")])),_:1})])),_:1}),(h(!0),p(b,null,m(e,((e,t)=>(h(),s(F,{key:t},{default:i((()=>[g(V,{align:"center"},{default:i((()=>[f(C(e.chatBoxId),1)])),_:2},1024),g(V,{align:"center"},{default:i((()=>[f(C(e.userId),1)])),_:2},1024),g(V,{align:"center"},{default:i((()=>[f(C(e.friendId),1)])),_:2},1024),g(V,{align:"center"},{default:i((()=>[f(C(1==e.status?"✅":"❌"),1)])),_:2},1024),g(V,{align:"center"},{default:i((()=>[f(C(e.message),1)])),_:2},1024),g(V,{align:"center"},{default:i((()=>[f(C(e.type),1)])),_:2},1024),g(V,{align:"center"},{default:i((()=>[f(C(1==e.delete?"✅":"❌"),1)])),_:2},1024),g(V,{align:"center"},{default:i((()=>[g(q,{threshold:[0,0],date:e.time},null,8,["date"])])),_:2},1024),g(V,{align:"center"},{default:i((()=>[g(z,{class:"uni-group"},{default:i((()=>[g(T,{onClick:t=>w.navigateTo("./edit?id="+e._id,!1),class:"uni-button",size:"mini",type:"primary"},{default:i((()=>[f("修改")])),_:2},1032,["onClick"]),g(T,{onClick:t=>w.confirmDelete(e._id),class:"uni-button",size:"mini",type:"warn"},{default:i((()=>[f("删除")])),_:2},1032,["onClick"])])),_:2},1024)])),_:2},1024)])),_:2},1024)))),128))])),_:2},1032,["loading","emptyText","onSelectionChange"]),g(z,{class:"uni-pagination-box"},{default:i((()=>[g(L,{"show-icon":"","page-size":a.size,modelValue:a.current,"onUpdate:modelValue":e=>a.current=e,total:a.count,onChange:w.onPageChanged},null,8,["page-size","modelValue","onUpdate:modelValue","total","onChange"])])),_:2},1024)])),_:1},8,["collection","where","orderby","page-size","page-current","options","onLoad"])])),_:1})])),_:1})}]]);export{T as default};
