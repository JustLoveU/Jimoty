import{_ as e,Y as a,M as t,N as l,p as s,G as o,s as m,r as d,a as u,c as n,w as r,am as i,i as f,o as c,g as p,j as h,U as b,m as y,Z as D}from"./index-DvwuWHCT.js";import{_ as V}from"./uni-easyinput.CI0qa16L.js";import{_}from"./uni-forms-item.D9H7wr3d.js";import{_ as g}from"./uni-forms.IzwqOl-w.js";import{v as I}from"./jimoty-chat-message.BmZ1O05K.js";const k=a.database();k.command;function j(e){let a={};for(let t in I)e.includes(t)&&(a[t]=I[t]);return a}const x=e({data(){let e={chatBoxId:"",userId:"",friendId:"",status:null,message:"",type:null,delete:null,time:null};return{formData:e,formOptions:{},rules:{...j(Object.keys(e))}}},onReady(){this.$refs.form.setRules(this.rules)},methods:{submit(){t({mask:!0}),this.$refs.form.validate().then((e=>this.submitForm(e))).catch((()=>{})).finally((()=>{l()}))},submitForm(e){return k.collection("jimoty-chat-message").add(e).then((e=>{s({title:"新增成功"}),this.getOpenerEventChannel().emit("refreshData"),setTimeout((()=>o()),500)})).catch((e=>{m({content:e.message||"请求服务失败",showCancel:!1})}))}}},[["render",function(e,a,t,l,s,o){const m=d(u("uni-easyinput"),V),I=d(u("uni-forms-item"),_),k=b,j=d(u("uni-datetime-picker"),i),x=y,U=D,v=f,C=d(u("uni-forms"),g);return c(),n(v,{class:"uni-container"},{default:r((()=>[p(C,{ref:"form",model:s.formData,validateTrigger:"bind"},{default:r((()=>[p(I,{name:"chatBoxId",label:"消息框id",required:""},{default:r((()=>[p(m,{placeholder:"消息所在的消息框",modelValue:s.formData.chatBoxId,"onUpdate:modelValue":a[0]||(a[0]=e=>s.formData.chatBoxId=e)},null,8,["modelValue"])])),_:1}),p(I,{name:"userId",label:"消息发送方",required:""},{default:r((()=>[p(m,{placeholder:"消息发送方 UserID（用于指定发送消息方帐号）",modelValue:s.formData.userId,"onUpdate:modelValue":a[1]||(a[1]=e=>s.formData.userId=e)},null,8,["modelValue"])])),_:1}),p(I,{name:"friendId",label:"消息接收方",required:""},{default:r((()=>[p(m,{placeholder:"消息接收方 UserID",modelValue:s.formData.friendId,"onUpdate:modelValue":a[2]||(a[2]=e=>s.formData.friendId=e)},null,8,["modelValue"])])),_:1}),p(I,{name:"status",label:"是否已读"},{default:r((()=>[p(k,{onChange:a[3]||(a[3]=a=>e.binddata("status",a.detail.value)),checked:s.formData.status},null,8,["checked"])])),_:1}),p(I,{name:"message",label:"消息内容"},{default:r((()=>[p(m,{placeholder:"消息内容",modelValue:s.formData.message,"onUpdate:modelValue":a[4]||(a[4]=e=>s.formData.message=e)},null,8,["modelValue"])])),_:1}),p(I,{name:"type",label:"消息类型"},{default:r((()=>[p(m,{placeholder:"消息内容（0文字，1图片链接，2音频链接，3地图）",type:"number",modelValue:s.formData.type,"onUpdate:modelValue":a[5]||(a[5]=e=>s.formData.type=e)},null,8,["modelValue"])])),_:1}),p(I,{name:"delete",label:"是否删除"},{default:r((()=>[p(k,{onChange:a[6]||(a[6]=a=>e.binddata("delete",a.detail.value)),checked:s.formData.delete},null,8,["checked"])])),_:1}),p(I,{name:"time",label:"消息创建时间"},{default:r((()=>[p(j,{"return-type":"timestamp",modelValue:s.formData.time,"onUpdate:modelValue":a[7]||(a[7]=e=>s.formData.time=e)},null,8,["modelValue"])])),_:1}),p(v,{class:"uni-button-group"},{default:r((()=>[p(x,{type:"primary",class:"uni-button",style:{width:"100px"},onClick:o.submit},{default:r((()=>[h("提交")])),_:1},8,["onClick"]),p(U,{"open-type":"navigateBack",style:{"margin-left":"15px"}},{default:r((()=>[p(x,{class:"uni-button",style:{width:"100px"}},{default:r((()=>[h("返回")])),_:1})])),_:1})])),_:1})])),_:1},8,["model"])])),_:1})}]]);export{x as default};