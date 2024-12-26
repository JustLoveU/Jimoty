import{_ as e,Y as t,n as a,r as n,a as l,c as d,w as o,i,b as s,d as r,e as u,f as c,o as h,g as f,j as g,k as p,l as _,F as m,I as y,m as b,t as C}from"./index-DvwuWHCT.js";import{_ as x}from"./download-excel.DZLKoZwF.js";import{_ as j}from"./uni-dateformat.DJj25wzG.js";import{_ as S}from"./uni-pagination.DcoG_qbw.js";import{_ as I}from"./unicloud-db.BruyzEc-.js";import{e as T,f as k}from"./jimoty-daoju-use.DPLJopXo.js";const D=t.database(),$=[],w={ascending:"asc",descending:"desc"};const z=e({data:()=>({collectionList:"jimoty-daoju-use",query:"",where:"",orderby:"",orderByFieldName:"",selectedIndexs:[],options:{pageSize:20,pageCurrent:1,filterData:{},...T},imageStyles:{width:64,height:64},exportExcel:{filename:"jimoty-daoju-use.xls",type:"xls",fields:{"道具使用者":"daojuUserId","被使用的投稿":"daojuPostId","道具类型":"daojuType",end_date:"end_date",delete:"delete",create_date:"create_date",update_date:"update_date"}},exportExcelData:[]}),onLoad(){this._filter={}},onReady(){this.$refs.udb.loadData()},methods:{onqueryload(e){this.exportExcelData=e},getWhere(){const e=this.query.trim();if(!e)return"";const t=new RegExp(e,"i");return $.map((e=>t+".test("+e+")")).join(" || ")},search(){const e=this.getWhere();this.where=e,this.$nextTick((()=>{this.loadData()}))},loadData(e=!0){this.$refs.udb.loadData({clear:e})},onPageChanged(e){this.selectedIndexs.length=0,this.$refs.table.clearSelection(),this.$refs.udb.loadData({current:e.current})},navigateTo(e,t){a({url:e,events:{refreshData:()=>{this.loadData(t)}}})},selectedItems(){var e=this.$refs.udb.dataList;return this.selectedIndexs.map((t=>e[t]._id))},delTable(){this.$refs.udb.remove(this.selectedItems(),{success:e=>{this.$refs.table.clearSelection()}})},selectionChange(e){this.selectedIndexs=e.detail.index},confirmDelete(e){this.$refs.udb.remove(e,{success:e=>{this.$refs.table.clearSelection()}})},sortChange(e,t){this.orderByFieldName=t,e.order?this.orderby=t+" "+w[e.order]:this.orderby="",this.$refs.table.clearSelection(),this.$nextTick((()=>{this.$refs.udb.loadData()}))},filterChange(e,t){this._filter[t]={type:e.filterType,value:e.filter};let a=k(this._filter,D.command);Object.keys(a).length?this.where=a:this.where="",this.$nextTick((()=>{this.$refs.udb.loadData()}))}}},[["render",function(e,t,a,T,k,D){const $=i,w=y,z=b,E=n(l("download-excel"),x),v=n(l("uni-th"),s),F=n(l("uni-tr"),r),U=n(l("uni-td"),u),V=n(l("uni-dateformat"),j),q=n(l("uni-table"),c),L=n(l("uni-pagination"),S),P=n(l("unicloud-db"),I);return h(),d($,null,{default:o((()=>[f($,{class:"uni-header"},{default:o((()=>[f($,{class:"uni-group"},{default:o((()=>[f($,{class:"uni-title"}),f($,{class:"uni-sub-title"})])),_:1}),f($,{class:"uni-group"},{default:o((()=>[f(w,{class:"uni-search",type:"text",modelValue:k.query,"onUpdate:modelValue":t[0]||(t[0]=e=>k.query=e),onConfirm:D.search,placeholder:"请输入搜索内容"},null,8,["modelValue","onConfirm"]),f(z,{class:"uni-button",type:"default",size:"mini",onClick:D.search},{default:o((()=>[g("搜索")])),_:1},8,["onClick"]),f(z,{class:"uni-button",type:"default",size:"mini",onClick:t[1]||(t[1]=e=>D.navigateTo("./add"))},{default:o((()=>[g("新增")])),_:1}),f(z,{class:"uni-button",type:"default",size:"mini",disabled:!k.selectedIndexs.length,onClick:D.delTable},{default:o((()=>[g("批量删除")])),_:1},8,["disabled","onClick"]),f(E,{class:"hide-on-phone",fields:k.exportExcel.fields,data:k.exportExcelData,type:k.exportExcel.type,name:k.exportExcel.filename},{default:o((()=>[f(z,{class:"uni-button",type:"primary",size:"mini"},{default:o((()=>[g("导出 Excel")])),_:1})])),_:1},8,["fields","data","type","name"])])),_:1})])),_:1}),f($,{class:"uni-container"},{default:o((()=>[f(P,{ref:"udb",collection:k.collectionList,field:"daojuUserId,daojuPostId,daojuType,end_date,delete,create_date,update_date",where:k.where,"page-data":"replace",orderby:k.orderby,getcount:!0,"page-size":k.options.pageSize,"page-current":k.options.pageCurrent,options:k.options,loadtime:"manual",onLoad:D.onqueryload},{default:o((({data:e,pagination:a,loading:n,error:l,options:i})=>[f(q,{ref:"table",loading:n,emptyText:l.message||"没有更多数据",border:"",stripe:"",type:"selection",onSelectionChange:D.selectionChange},{default:o((()=>[f(F,null,{default:o((()=>[f(v,{align:"center",sortable:"",onSortChange:t[2]||(t[2]=e=>D.sortChange(e,"daojuUserId"))},{default:o((()=>[g("道具使用者")])),_:1}),f(v,{align:"center",sortable:"",onSortChange:t[3]||(t[3]=e=>D.sortChange(e,"daojuPostId"))},{default:o((()=>[g("被使用的投稿")])),_:1}),f(v,{align:"center","filter-type":"range",onFilterChange:t[4]||(t[4]=e=>D.filterChange(e,"daojuType")),sortable:"",onSortChange:t[5]||(t[5]=e=>D.sortChange(e,"daojuType"))},{default:o((()=>[g("道具类型")])),_:1}),f(v,{align:"center","filter-type":"timestamp",onFilterChange:t[6]||(t[6]=e=>D.filterChange(e,"end_date")),sortable:"",onSortChange:t[7]||(t[7]=e=>D.sortChange(e,"end_date"))},{default:o((()=>[g("end_date")])),_:1}),f(v,{align:"center",sortable:"",onSortChange:t[8]||(t[8]=e=>D.sortChange(e,"delete"))},{default:o((()=>[g("delete")])),_:1}),f(v,{align:"center","filter-type":"timestamp",onFilterChange:t[9]||(t[9]=e=>D.filterChange(e,"create_date")),sortable:"",onSortChange:t[10]||(t[10]=e=>D.sortChange(e,"create_date"))},{default:o((()=>[g("create_date")])),_:1}),f(v,{align:"center","filter-type":"timestamp",onFilterChange:t[11]||(t[11]=e=>D.filterChange(e,"update_date")),sortable:"",onSortChange:t[12]||(t[12]=e=>D.sortChange(e,"update_date"))},{default:o((()=>[g("update_date")])),_:1}),f(v,{align:"center"},{default:o((()=>[g("操作")])),_:1})])),_:1}),(h(!0),p(m,null,_(e,((e,t)=>(h(),d(F,{key:t},{default:o((()=>[f(U,{align:"center"},{default:o((()=>[g(C(e.daojuUserId),1)])),_:2},1024),f(U,{align:"center"},{default:o((()=>[g(C(e.daojuPostId),1)])),_:2},1024),f(U,{align:"center"},{default:o((()=>[g(C(e.daojuType),1)])),_:2},1024),f(U,{align:"center"},{default:o((()=>[f(V,{threshold:[0,0],date:e.end_date},null,8,["date"])])),_:2},1024),f(U,{align:"center"},{default:o((()=>[g(C(1==e.delete?"✅":"❌"),1)])),_:2},1024),f(U,{align:"center"},{default:o((()=>[f(V,{threshold:[0,0],date:e.create_date},null,8,["date"])])),_:2},1024),f(U,{align:"center"},{default:o((()=>[f(V,{threshold:[0,0],date:e.update_date},null,8,["date"])])),_:2},1024),f(U,{align:"center"},{default:o((()=>[f($,{class:"uni-group"},{default:o((()=>[f(z,{onClick:t=>D.navigateTo("./edit?id="+e._id,!1),class:"uni-button",size:"mini",type:"primary"},{default:o((()=>[g("修改")])),_:2},1032,["onClick"]),f(z,{onClick:t=>D.confirmDelete(e._id),class:"uni-button",size:"mini",type:"warn"},{default:o((()=>[g("删除")])),_:2},1032,["onClick"])])),_:2},1024)])),_:2},1024)])),_:2},1024)))),128))])),_:2},1032,["loading","emptyText","onSelectionChange"]),f($,{class:"uni-pagination-box"},{default:o((()=>[f(L,{"show-icon":"","page-size":a.size,modelValue:a.current,"onUpdate:modelValue":e=>a.current=e,total:a.count,onChange:D.onPageChanged},null,8,["page-size","modelValue","onUpdate:modelValue","total","onChange"])])),_:2},1024)])),_:1},8,["collection","where","orderby","page-size","page-current","options","onLoad"])])),_:1})])),_:1})}]]);export{z as default};