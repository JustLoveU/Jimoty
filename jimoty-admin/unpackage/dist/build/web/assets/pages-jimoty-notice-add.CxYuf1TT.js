import{_ as e,Y as a,M as s,p as t,N as o,s as l,r,a as i,c as n,w as m,i as u,o as d,g as f,j as c,m as p,Z as h}from"./index-DvwuWHCT.js";import{_ as g}from"./uni-easyinput.CI0qa16L.js";import{_ as y}from"./uni-forms-item.D9H7wr3d.js";import{_}from"./uni-forms.IzwqOl-w.js";import{v as b}from"./jimoty-notice.CyVwI5_S.js";const j=a.database();j.command;function D(e){let a={};for(let s in b)e.includes(s)&&(a[s]=b[s]);return a}a.getCurrentUserInfo().uid;const M=e({data(){let e={type:0,sendPeople:"66f00e149755e3b8e775034c",receive:"",message:"",otherMessage:"系统消息"};return{formData:e,formOptions:{},rules:{...D(Object.keys(e))}}},onReady(){this.$refs.form.setRules(this.rules)},methods:{submit(){s({mask:!0}),""!=this.formData.message?this.$refs.form.validate().then((e=>this.submitForm(e))).catch((()=>{})).finally((()=>{o()})):t({title:"请输入消息",icon:"none"})},async submitForm(e){(await j.collection("uni-id-users").field("_id").get()).result.data.forEach((e=>{let a={type:0,sendPeople:"66f00e149755e3b8e775034c",receive:e._id,message:this.formData.message,otherMessage:this.formData.otherMessage};console.log(a),j.collection("jimoty-notice").add(a).then((e=>{})).catch((e=>{l({content:e.message||"请求服务失败",showCancel:!1})}))}))}}},[["render",function(e,a,s,t,o,l){const b=u,j=r(i("uni-easyinput"),g),D=r(i("uni-forms-item"),y),M=p,v=h,V=r(i("uni-forms"),_);return d(),n(b,{class:"uni-container"},{default:m((()=>[f(b,{class:""},{default:m((()=>[c(" 发送系统消息： ")])),_:1}),f(V,{ref:"form",model:o.formData,validateTrigger:"bind"},{default:m((()=>[f(D,{name:"message",label:"消息",required:""},{default:m((()=>[f(j,{placeholder:"消息",modelValue:o.formData.message,"onUpdate:modelValue":a[0]||(a[0]=e=>o.formData.message=e)},null,8,["modelValue"])])),_:1}),f(D,{name:"otherMessage",label:"其他消息"},{default:m((()=>[f(j,{placeholder:"其他消息",modelValue:o.formData.otherMessage,"onUpdate:modelValue":a[1]||(a[1]=e=>o.formData.otherMessage=e)},null,8,["modelValue"])])),_:1}),f(b,{class:"uni-button-group"},{default:m((()=>[f(M,{type:"primary",class:"uni-button",style:{width:"100px"},onClick:l.submit},{default:m((()=>[c("发送")])),_:1},8,["onClick"]),f(v,{"open-type":"navigateBack",style:{"margin-left":"15px"}},{default:m((()=>[f(M,{class:"uni-button",style:{width:"100px"}},{default:m((()=>[c("返回")])),_:1})])),_:1})])),_:1})])),_:1},8,["model"])])),_:1})}]]);export{M as default};