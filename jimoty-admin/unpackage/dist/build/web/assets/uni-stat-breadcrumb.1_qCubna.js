import{_ as a,ad as t,y as r,n as e,o as s,c as u,w as o,g as n,z as d,C as i,k as c,j as l,t as p,i as m,u as b,E as f,r as _,a as h,F as v,l as g}from"./index-DvwuWHCT.js";const y=a({data:()=>({currentPage:""}),options:{virtualHost:!0},props:{to:{type:String,default:""},replace:{type:Boolean,default:!1}},inject:{uniBreadcrumb:{from:"uniBreadcrumb",default:null}},created(){const a=t(),r=a[a.length-1];r&&(this.currentPage=`/${r.route}`)},computed:{separator(){return this.uniBreadcrumb&&this.uniBreadcrumb.separator},separatorClass(){return this.uniBreadcrumb&&this.uniBreadcrumb.separatorClass}},methods:{navTo(){const{to:a}=this;a&&this.currentPage!==a&&(this.replace?r({url:a}):e({url:a}))}}},[["render",function(a,t,r,e,f,_){const h=m,v=b;return s(),u(h,{class:"uni-breadcrumb-item"},{default:o((()=>[n(h,{class:d({"uni-breadcrumb-item--slot":!0,"uni-breadcrumb-item--slot-link":r.to&&f.currentPage!==r.to}),onClick:_.navTo},{default:o((()=>[i(a.$slots,"default",{},void 0,!0)])),_:3},8,["class","onClick"]),_.separatorClass?(s(),c("i",{key:0,class:d(["uni-breadcrumb-item--separator",_.separatorClass])},null,2)):(s(),u(v,{key:1,class:"uni-breadcrumb-item--separator"},{default:o((()=>[l(p(_.separator),1)])),_:1}))])),_:3})}],["__scopeId","data-v-3d29b642"]]);const B=a({options:{virtualHost:!0},props:{separator:{type:String,default:"/"},separatorClass:{type:String,default:""}},provide(){return{uniBreadcrumb:this}}},[["render",function(a,t,r,e,n,d){const c=m;return s(),u(c,{class:"uni-breadcrumb"},{default:o((()=>[i(a.$slots,"default",{},void 0,!0)])),_:3})}],["__scopeId","data-v-fd9c4191"]]);const C=a({name:"uni-stat-breadcrumb",data:()=>({}),computed:{...f("app",["routes"])}},[["render",function(a,t,r,e,d,i){const b=_(h("uni-breadcrumb-item"),y),f=_(h("uni-breadcrumb"),B),C=m;return s(),u(C,{class:"uni-breadcrumb-x"},{default:o((()=>[n(f,{separator:"/"},{default:o((()=>[(s(!0),c(v,null,g(a.routes,((a,t)=>(s(),u(b,{key:t,to:a.to&&a.to.path||""},{default:o((()=>[l(p(a.name),1)])),_:2},1032,["to"])))),128))])),_:1})])),_:1})}],["__scopeId","data-v-90ba69fd"]]);export{C as _};