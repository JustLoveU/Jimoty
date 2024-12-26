import{_ as e,Y as s,n as a,p as t,r as i,a as n,c as o,w as r,i as u,o as l,g as c,j as d,h as m,t as p,q as h,u as f,m as g}from"./index-DvwuWHCT.js";import{_ as w}from"./uni-easyinput.CI0qa16L.js";import{_}from"./uni-forms-item.D9H7wr3d.js";import{_ as b}from"./uni-forms.IzwqOl-w.js";import{_ as C}from"./uni-captcha.mlSDC388.js";import{_ as k}from"./uni-id-pages-agreements.BOhrc_iq.js";import{_ as y}from"./uni-id-pages-fab-login.CvwG7N7J.js";import{m as x}from"./login-page.mixin.CMWQGSJY.js";import"./uni-popup-dialog.BXikTJNN.js";const j=s.importObject("uni-id-co",{errorOptions:{type:"toast"}});const V=e({mixins:[x],data:()=>({password:"",username:"",captcha:"",needCaptcha:!1,focusUsername:!1,focusPassword:!1,logo:"/static/logo.png",existAdmin:!0}),onShow(){document.onkeydown=e=>{let s=e||window.event;s&&13==s.keyCode&&this.pwdLogin()}},async onLoad(){try{const e=s.database();let a=(await e.collection("uni-id-users").where({role:"admin"}).count()).result.total;this.existAdmin=a>0}catch(e){this.existAdmin=!1}},methods:{toRetrievePwd(){let e="/uni_modules/uni-id-pages/pages/retrieve/retrieve";/^1\d{10}$/.test(this.username)&&(e+=`?phoneNumber=${this.username}`),a({url:e})},pwdLogin(){if(!this.password.length)return this.focusPassword=!0,t({title:"请输入密码",icon:"none",duration:3e3});if(!this.username.length)return this.focusUsername=!0,t({title:"请输入手机号/用户名/邮箱",icon:"none",duration:3e3});if(this.needCaptcha&&4!=this.captcha.length)return this.$refs.captcha.getImageCaptcha(),t({title:"请输入验证码",icon:"none",duration:3e3});if(this.needAgreements&&!this.agree)return this.$refs.agreements.popup(this.pwdLogin);let e={password:this.password,captcha:this.captcha};/^1\d{10}$/.test(this.username)?e.mobile=this.username:/@/.test(this.username)?e.email=this.username:e.username=this.username,j.login(e).then((e=>{this.loginSuccess(e)})).catch((e=>{"uni-id-captcha-required"==e.errCode?this.needCaptcha=!0:this.needCaptcha&&this.$refs.captcha.getImageCaptcha()}))},toRegister(){a({url:this.config.isAdmin?"/uni_modules/uni-id-pages/pages/register/register-admin":"/uni_modules/uni-id-pages/pages/register/register",fail(e){console.error(e)}})}}},[["render",function(e,s,a,t,x,j){const V=h,A=u,L=f,U=i(n("uni-easyinput"),w),v=i(n("uni-forms-item"),_),P=i(n("uni-forms"),b),$=i(n("uni-captcha"),C),B=i(n("uni-id-pages-agreements"),k),I=g,R=i(n("uni-id-pages-fab-login"),y);return l(),o(A,{class:"uni-content"},{default:r((()=>[c(A,{class:"login-logo"},{default:r((()=>[c(V,{src:x.logo},null,8,["src"])])),_:1}),c(L,{class:"title title-box"},{default:r((()=>[d("账号密码登录")])),_:1}),c(P,null,{default:r((()=>[c(v,{name:"username"},{default:r((()=>[c(U,{focus:x.focusUsername,onBlur:s[0]||(s[0]=e=>x.focusUsername=!1),class:"input-box",inputBorder:!1,modelValue:x.username,"onUpdate:modelValue":s[1]||(s[1]=e=>x.username=e),placeholder:"请输入手机号/用户名/邮箱"},null,8,["focus","modelValue"])])),_:1}),c(v,{name:"password"},{default:r((()=>[c(U,{focus:x.focusPassword,onBlur:s[2]||(s[2]=e=>x.focusPassword=!1),class:"input-box",clearable:"",type:"password",inputBorder:!1,modelValue:x.password,"onUpdate:modelValue":s[3]||(s[3]=e=>x.password=e),placeholder:"请输入密码"},null,8,["focus","modelValue"])])),_:1})])),_:1}),x.needCaptcha?(l(),o($,{key:0,focus:"",ref:"captcha",scene:"login-by-pwd",modelValue:x.captcha,"onUpdate:modelValue":s[4]||(s[4]=e=>x.captcha=e)},null,8,["modelValue"])):m("",!0),c(B,{scope:"login",ref:"agreements"},null,512),c(I,{class:"uni-btn",type:"primary",onClick:j.pwdLogin},{default:r((()=>[d("登录")])),_:1},8,["onClick"]),c(A,{class:"link-box"},{default:r((()=>[e.config.isAdmin?m("",!0):(l(),o(A,{key:0},{default:r((()=>[c(L,{class:"forget"},{default:r((()=>[d("忘记了？")])),_:1}),c(L,{class:"link",onClick:j.toRetrievePwd},{default:r((()=>[d("找回密码")])),_:1},8,["onClick"])])),_:1})),x.existAdmin?m("",!0):(l(),o(L,{key:1,class:"link",onClick:j.toRegister},{default:r((()=>[d(p(e.config.isAdmin?"注册管理员账号":"注册账号"),1)])),_:1},8,["onClick"]))])),_:1}),c(R,{ref:"uniFabLogin"},null,512)])),_:1})}],["__scopeId","data-v-ce6b7fc1"]]);export{V as default};
