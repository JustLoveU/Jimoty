const e={appid:{rules:[{required:!0},{format:"string"}],label:"AppID"},name:{rules:[{required:!0},{format:"string"}],label:"应用名称"},icon_url:{rules:[{format:"string"}],label:"应用图标"},introduction:{rules:[{format:"string"}],label:"应用简介"},description:{rules:[{format:"string"}],label:"应用描述"},screenshot:{rules:[{format:"array"}],label:"应用截图"},create_date:{rules:[{format:"timestamp"}],label:"发行时间"}};function t(e,t){let a={};for(let r in e){let{type:l,value:s}=e[r];switch(l){case"search":"string"==typeof s&&s.length&&(a[r]=new RegExp(s));break;case"select":if(s.length){let e=[];for(let a of s)e.push(t.eq(a));a[r]=t.or(e)}break;case"range":if(s.length){let e=s[0],l=s[1];a[r]=t.and([t.gte(e),t.lte(l)])}break;case"date":if(s.length){let[e,l]=s,n=new Date(e),i=new Date(l);a[r]=t.and([t.gte(n),t.lte(i)])}break;case"timestamp":if(s.length){let[e,l]=s;a[r]=t.and([t.gte(e),t.lte(l)])}}}return a}const a={},r={mp_weixin:"微信小程序",mp_alipay:"支付宝小程序",mp_baidu:"百度小程序",mp_toutiao:"字节小程序",mp_qq:"QQ小程序",mp_dingtalk:"钉钉小程序",mp_kuaishou:"快手小程序",mp_lark:"飞书小程序",mp_jd:"京东小程序",quickapp:"快应用"};export{a as e,t as f,r as m,e as v};
