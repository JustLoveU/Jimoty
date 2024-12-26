import{_ as e,Y as a,n as s,G as o,r,a as t,c as l,w as i,i as m,o as u,g as n,j as d,q as c,u as p,m as f}from"./index-DvwuWHCT.js";import{_ as g}from"./uni-match-media.QMLgufZj.js";import{_ as h}from"./uni-easyinput.CI0qa16L.js";import{_ as w}from"./uni-forms-item.D9H7wr3d.js";import{_}from"./uni-id-pages-email-form.DarXTXCA.js";import{_ as k}from"./uni-id-pages-agreements.BOhrc_iq.js";import{_ as b}from"./uni-forms.IzwqOl-w.js";import"./validator.DoLc0pl6.js";import{m as V}from"./login-page.mixin.CMWQGSJY.js";import{p as D}from"./password.LegsRrPx.js";import"./uni-captcha.mlSDC388.js";import"./uni-popup-dialog.BXikTJNN.js";const y=a.importObject("uni-id-co");const j=e({mixins:[V],data:()=>({formData:{email:"",nickname:"",password:"",password2:"",code:""},rules:{email:{rules:[{required:!0,errorMessage:"请输入邮箱"},{format:"email",errorMessage:"邮箱格式不正确"}]},nickname:{rules:[{minLength:3,maxLength:32,errorMessage:"昵称长度在 {minLength} 到 {maxLength} 个字符"},{validateFunction:function(e,a,s,o){return(/^1\d{10}$/.test(a)||/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(a))&&o("昵称不能是：手机号或邮箱"),/^\d+$/.test(a)&&o("昵称不能为纯数字"),!0}}],label:"昵称"},...D.getPwdRules(),code:{rules:[{required:!0,errorMessage:"请输入邮箱验证码"},{pattern:/^.{6}$/,errorMessage:"邮箱验证码不正确"}]}},focusEmail:!1,focusNickname:!1,focusPassword:!1,focusPassword2:!1,logo:"/static/logo.png"}),onReady(){this.$refs.form.setRules(this.rules)},onShow(){document.onkeydown=e=>{let a=e||window.event;a&&13==a.keyCode&&this.submit()}},methods:{submit(){this.$refs.form.validate().then((e=>{if(this.needAgreements&&!this.agree)return this.$refs.agreements.popup((()=>{this.submitForm(e)}));this.submitForm(e)})).catch((e=>{let a=e[0].key;a=a.replace(a[0],a[0].toUpperCase()),this["focus"+a]=!0}))},submitForm(e){y.registerUserByEmail(this.formData).then((e=>{s({url:"/uni_modules/uni-id-pages/pages/login/login-withpwd",complete:e=>{}})})).catch((e=>{console.log(e.message)}))},navigateBack(){o()},toLogin(){s({url:"/uni_modules/uni-id-pages/pages/login/login-withpwd"})},registerByUserName(){s({url:"/uni_modules/uni-id-pages/pages/register/register"})}}},[["render",function(e,a,s,o,V,D){const y=c,j=m,x=p,B=r(t("uni-match-media"),g),C=r(t("uni-easyinput"),h),U=r(t("uni-forms-item"),w),v=r(t("uni-id-pages-email-form"),_),P=r(t("uni-id-pages-agreements"),k),$=f,q=r(t("uni-forms"),b);return u(),l(j,{class:"uni-content"},{default:i((()=>[n(B,{"min-width":690},{default:i((()=>[n(j,{class:"login-logo"},{default:i((()=>[n(y,{src:V.logo},null,8,["src"])])),_:1}),n(x,{class:"title title-box"},{default:i((()=>[d("邮箱验证码注册")])),_:1})])),_:1}),n(q,{ref:"form",value:V.formData,rules:V.rules,"validate-trigger":"submit","err-show-type":"toast"},{default:i((()=>[n(U,{name:"email",required:""},{default:i((()=>[n(C,{inputBorder:!1,focus:V.focusEmail,onBlur:a[0]||(a[0]=e=>V.focusEmail=!1),class:"input-box",placeholder:"请输入邮箱",modelValue:V.formData.email,"onUpdate:modelValue":a[1]||(a[1]=e=>V.formData.email=e),trim:"both"},null,8,["focus","modelValue"])])),_:1}),n(U,{name:"nickname"},{default:i((()=>[n(C,{inputBorder:!1,focus:V.focusNickname,onBlur:a[2]||(a[2]=e=>V.focusNickname=!1),class:"input-box",placeholder:"请输入用户昵称",modelValue:V.formData.nickname,"onUpdate:modelValue":a[3]||(a[3]=e=>V.formData.nickname=e),trim:"both"},null,8,["focus","modelValue"])])),_:1}),n(U,{name:"password",modelValue:V.formData.password,"onUpdate:modelValue":a[6]||(a[6]=e=>V.formData.password=e),required:""},{default:i((()=>[n(C,{inputBorder:!1,focus:V.focusPassword,onBlur:a[4]||(a[4]=e=>V.focusPassword=!1),class:"input-box",maxlength:"20",placeholder:"请输入"+("weak"==e.config.passwordStrength?"6":"8")+"-16位密码",type:"password",modelValue:V.formData.password,"onUpdate:modelValue":a[5]||(a[5]=e=>V.formData.password=e),trim:"both"},null,8,["focus","placeholder","modelValue"])])),_:1},8,["modelValue"]),n(U,{name:"password2",modelValue:V.formData.password2,"onUpdate:modelValue":a[9]||(a[9]=e=>V.formData.password2=e),required:""},{default:i((()=>[n(C,{inputBorder:!1,focus:V.focusPassword2,onBlur:a[7]||(a[7]=e=>V.focusPassword2=!1),class:"input-box",placeholder:"再次输入密码",maxlength:"20",type:"password",modelValue:V.formData.password2,"onUpdate:modelValue":a[8]||(a[8]=e=>V.formData.password2=e),trim:"both"},null,8,["focus","modelValue"])])),_:1},8,["modelValue"]),n(U,{name:"code"},{default:i((()=>[n(v,{ref:"shortCode",email:V.formData.email,type:"register",modelValue:V.formData.code,"onUpdate:modelValue":a[10]||(a[10]=e=>V.formData.code=e)},null,8,["email","modelValue"])])),_:1}),n(P,{scope:"register",ref:"agreements"},null,512),n($,{class:"uni-btn",type:"primary",onClick:D.submit},{default:i((()=>[d("注册")])),_:1},8,["onClick"]),n($,{onClick:D.navigateBack,class:"register-back"},{default:i((()=>[d("返回")])),_:1},8,["onClick"]),n(B,{"min-width":690},{default:i((()=>[n(j,{class:"link-box"},{default:i((()=>[n(x,{class:"link",onClick:D.registerByUserName},{default:i((()=>[d("用户名密码注册")])),_:1},8,["onClick"]),n(x,{class:"link",onClick:D.toLogin},{default:i((()=>[d("已有账号？点此登录")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1},8,["value","rules"])])),_:1})}],["__scopeId","data-v-414dfc02"]]);export{j as default};
