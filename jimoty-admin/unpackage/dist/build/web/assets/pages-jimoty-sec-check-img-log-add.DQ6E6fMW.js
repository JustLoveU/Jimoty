import{_ as e,Y as a,M as t,N as l,p as s,G as o,s as r,r as i,a as m,c as u,w as n,am as d,i as f,o as c,g as p,j as _,m as h,Z as b}from"./index-DvwuWHCT.js";import{_ as y}from"./uni-easyinput.CI0qa16L.js";import{_ as V}from"./uni-forms-item.D9H7wr3d.js";import{_ as D}from"./uni-forms.IzwqOl-w.js";import{v as g}from"./jimoty-sec-check-img-log.xURL3mHd.js";const j=a.database();j.command;function v(e){let a={};for(let t in g)e.includes(t)&&(a[t]=g[t]);return a}const k=e({data(){let e={verify_id:"",traceId:"",picurl:"",state:null,publish_date:null};return{formData:e,formOptions:{},rules:{...v(Object.keys(e))}}},onReady(){this.$refs.form.setRules(this.rules)},methods:{submit(){t({mask:!0}),this.$refs.form.validate().then((e=>this.submitForm(e))).catch((()=>{})).finally((()=>{l()}))},submitForm(e){return j.collection("jimoty-sec-check-img-log").add(e).then((e=>{s({title:"新增成功"}),this.getOpenerEventChannel().emit("refreshData"),setTimeout((()=>o()),500)})).catch((e=>{r({content:e.message||"请求服务失败",showCancel:!1})}))}}},[["render",function(e,a,t,l,s,o){const r=i(m("uni-easyinput"),y),g=i(m("uni-forms-item"),V),j=i(m("uni-datetime-picker"),d),v=h,k=b,x=f,I=i(m("uni-forms"),D);return c(),u(x,{class:"uni-container"},{default:n((()=>[p(I,{ref:"form",model:s.formData,validateTrigger:"bind"},{default:n((()=>[p(g,{name:"verify_id",label:"业务id",required:""},{default:n((()=>[p(r,{modelValue:s.formData.verify_id,"onUpdate:modelValue":a[0]||(a[0]=e=>s.formData.verify_id=e)},null,8,["modelValue"])])),_:1}),p(g,{name:"traceId",label:"唯一标识id"},{default:n((()=>[p(r,{modelValue:s.formData.traceId,"onUpdate:modelValue":a[1]||(a[1]=e=>s.formData.traceId=e)},null,8,["modelValue"])])),_:1}),p(g,{name:"picurl",label:"图片",required:""},{default:n((()=>[p(r,{modelValue:s.formData.picurl,"onUpdate:modelValue":a[2]||(a[2]=e=>s.formData.picurl=e)},null,8,["modelValue"])])),_:1}),p(g,{name:"state",label:"图片状态",required:""},{default:n((()=>[p(r,{placeholder:"0待审核 1通过 2未通过",type:"number",modelValue:s.formData.state,"onUpdate:modelValue":a[3]||(a[3]=e=>s.formData.state=e)},null,8,["modelValue"])])),_:1}),p(g,{name:"publish_date",label:"提交审核时间"},{default:n((()=>[p(j,{"return-type":"timestamp",modelValue:s.formData.publish_date,"onUpdate:modelValue":a[4]||(a[4]=e=>s.formData.publish_date=e)},null,8,["modelValue"])])),_:1}),p(x,{class:"uni-button-group"},{default:n((()=>[p(v,{type:"primary",class:"uni-button",style:{width:"100px"},onClick:o.submit},{default:n((()=>[_("提交")])),_:1},8,["onClick"]),p(k,{"open-type":"navigateBack",style:{"margin-left":"15px"}},{default:n((()=>[p(v,{class:"uni-button",style:{width:"100px"}},{default:n((()=>[_("返回")])),_:1})])),_:1})])),_:1})])),_:1},8,["model"])])),_:1})}]]);export{k as default};
