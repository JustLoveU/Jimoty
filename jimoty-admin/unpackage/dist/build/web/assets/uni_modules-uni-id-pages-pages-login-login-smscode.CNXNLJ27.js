import{_ as o,Y as s,p as e,r as t,a,c as n,w as i,i as p,o as c,g as l,j as u,q as r,u as m,m as d}from"./index-DvwuWHCT.js";import{_ as h}from"./uni-id-pages-sms-form.DYeCJ08M.js";import{_ as f}from"./uni-forms.IzwqOl-w.js";import{_ as g}from"./uni-popup-captcha.CoXWxQ8F.js";import{m as _}from"./login-page.mixin.CMWQGSJY.js";import"./uni-captcha.mlSDC388.js";import"./uni-easyinput.CI0qa16L.js";const b=o({mixins:[_],data:()=>({code:"",phone:"",captcha:"",logo:"/static/logo.png"}),computed:{tipText(){return"验证码已通过短信发送至"+this.phone}},onLoad({phoneNumber:o}){this.phone=o},onShow(){document.onkeydown=o=>{let s=o||window.event;s&&13==s.keyCode&&this.submit()}},methods:{submit(){const o=s.importObject("uni-id-co",{errorOptions:{type:"toast"}});if(6!=this.code.length)return this.$refs.smsCode.focusSmsCodeInput=!0,e({title:"验证码不能为空",icon:"none",duration:3e3});o.loginBySms({mobile:this.phone,code:this.code,captcha:this.captcha}).then((o=>{this.loginSuccess(o)})).catch((o=>{"uni-id-captcha-required"==o.errCode?this.$refs.popup.open():console.log(o.errMsg)})).finally((o=>{this.captcha=""}))}}},[["render",function(o,s,e,_,b,y){const C=r,j=p,V=m,w=t(a("uni-id-pages-sms-form"),h),x=d,k=t(a("uni-forms"),f),I=t(a("uni-popup-captcha"),g);return c(),n(j,{class:"uni-content"},{default:i((()=>[l(j,{class:"login-logo"},{default:i((()=>[l(C,{src:b.logo},null,8,["src"])])),_:1}),l(V,{class:"title"},{default:i((()=>[u("请输入验证码")])),_:1}),l(V,{class:"tip"},{default:i((()=>[u("先输入图形验证码，再获取短信验证码")])),_:1}),l(k,null,{default:i((()=>[l(w,{focusCaptchaInput:"",modelValue:b.code,"onUpdate:modelValue":s[0]||(s[0]=o=>b.code=o),type:"login-by-sms",ref:"smsCode",phone:b.phone},null,8,["modelValue","phone"]),l(x,{class:"uni-btn send-btn",type:"primary",onClick:y.submit},{default:i((()=>[u("登录")])),_:1},8,["onClick"])])),_:1}),l(I,{onConfirm:y.submit,modelValue:b.captcha,"onUpdate:modelValue":s[1]||(s[1]=o=>b.captcha=o),scene:"login-by-sms",ref:"popup"},null,8,["onConfirm","modelValue"])])),_:1})}],["__scopeId","data-v-4dd4a63e"]]);export{b as default};