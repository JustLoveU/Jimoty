const e={daojuUserId:{rules:[{required:!0},{format:"string"}],title:"道具使用者",defaultValue:{$env:"uid"},label:"道具使用者"},daojuPostId:{rules:[{required:!0},{format:"string"}],title:"被使用的投稿",label:"被使用的投稿"},daojuType:{rules:[{format:"int"}],title:"道具类型",label:"道具类型"},end_date:{rules:[{format:"timestamp"}]},delete:{rules:[{format:"bool"}],defaultValue:!1},create_date:{rules:[{format:"timestamp"}]},update_date:{rules:[{format:"timestamp"}]}},t={};function a(e,t){let a={};for(let l in e){let{type:r,value:s}=e[l];switch(r){case"search":"string"==typeof s&&s.length&&(a[l]=new RegExp(s));break;case"select":if(s.length){let e=[];for(let a of s)e.push(t.eq(a));a[l]=t.or(e)}break;case"range":if(s.length){let e=s[0],r=s[1];a[l]=t.and([t.gte(e),t.lte(r)])}break;case"date":if(s.length){let[e,r]=s,n=new Date(e),u=new Date(r);a[l]=t.and([t.gte(n),t.lte(u)])}break;case"timestamp":if(s.length){let[e,r]=s;a[l]=t.and([t.gte(e),t.lte(r)])}}}return a}export{t as e,a as f,e as v};
