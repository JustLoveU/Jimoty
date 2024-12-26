import{_ as e,Y as a,M as t,N as l,p as s,G as o,s as d,r,a as n,c as i,w as m,am as u,i as f,o as c,g as p,j as h,U as I,m as _,Z as D}from"./index-DvwuWHCT.js";import{_ as b}from"./uni-easyinput.CI0qa16L.js";import{_ as y}from"./uni-forms-item.D9H7wr3d.js";import{_ as g}from"./uni-forms.IzwqOl-w.js";import{v as V}from"./jimoty-chat.-bje5S05.js";const j=a.database();j.command;function k(e){let a={};for(let t in V)e.includes(t)&&(a[t]=V[t]);return a}const U=e({data(){let e={userId:"",friendId:"",postId:"",delete:null,create_date:null};return{formData:e,formOptions:{},rules:{...k(Object.keys(e))}}},onLoad(e){if(e.id){const a=e.id;this.formDataId=a,this.getDetail(a)}},onReady(){this.$refs.form.setRules(this.rules)},methods:{submit(){t({mask:!0}),this.$refs.form.validate().then((e=>this.submitForm(e))).catch((()=>{})).finally((()=>{l()}))},submitForm(e){return j.collection("jimoty-chat").doc(this.formDataId).update(e).then((e=>{s({title:"修改成功"}),this.getOpenerEventChannel().emit("refreshData"),setTimeout((()=>o()),500)})).catch((e=>{d({content:e.message||"请求服务失败",showCancel:!1})}))},getDetail(e){t({mask:!0}),j.collection("jimoty-chat").doc(e).field("userId,friendId,postId,delete,create_date").get().then((e=>{const a=e.result.data[0];a&&(this.formData=a)})).catch((e=>{d({content:e.message||"请求服务失败",showCancel:!1})})).finally((()=>{l()}))}}},[["render",function(e,a,t,l,s,o){const d=r(n("uni-easyinput"),b),V=r(n("uni-forms-item"),y),j=I,k=r(n("uni-datetime-picker"),u),U=_,v=D,C=f,w=r(n("uni-forms"),g);return c(),i(C,{class:"uni-container"},{default:m((()=>[p(w,{ref:"form",model:s.formData,validateTrigger:"bind"},{default:m((()=>[p(V,{name:"userId",label:"消息框创建者",required:""},{default:m((()=>[p(d,{placeholder:"消息发送方 UserID（用于指定发送消息方帐号）",modelValue:s.formData.userId,"onUpdate:modelValue":a[0]||(a[0]=e=>s.formData.userId=e)},null,8,["modelValue"])])),_:1}),p(V,{name:"friendId",label:"消息框接收方",required:""},{default:m((()=>[p(d,{placeholder:"消息接收方 UserID",modelValue:s.formData.friendId,"onUpdate:modelValue":a[1]||(a[1]=e=>s.formData.friendId=e)},null,8,["modelValue"])])),_:1}),p(V,{name:"postId",label:"讨论的商品",required:""},{default:m((()=>[p(d,{placeholder:"讨论的商品 postId",modelValue:s.formData.postId,"onUpdate:modelValue":a[2]||(a[2]=e=>s.formData.postId=e)},null,8,["modelValue"])])),_:1}),p(V,{name:"delete",label:"是否删除"},{default:m((()=>[p(j,{onChange:a[3]||(a[3]=a=>e.binddata("delete",a.detail.value)),checked:s.formData.delete},null,8,["checked"])])),_:1}),p(V,{name:"create_date",label:"消息框创建时间"},{default:m((()=>[p(k,{"return-type":"timestamp",modelValue:s.formData.create_date,"onUpdate:modelValue":a[4]||(a[4]=e=>s.formData.create_date=e)},null,8,["modelValue"])])),_:1}),p(C,{class:"uni-button-group"},{default:m((()=>[p(U,{type:"primary",class:"uni-button",style:{width:"100px"},onClick:o.submit},{default:m((()=>[h("提交")])),_:1},8,["onClick"]),p(v,{"open-type":"navigateBack",style:{"margin-left":"15px"}},{default:m((()=>[p(U,{class:"uni-button",style:{width:"100px"}},{default:m((()=>[h("返回")])),_:1})])),_:1})])),_:1})])),_:1},8,["model"])])),_:1})}]]);export{U as default};
