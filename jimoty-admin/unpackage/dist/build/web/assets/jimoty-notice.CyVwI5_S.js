const e={type:{rules:[{required:!0},{format:"int"}],title:"通知类型",label:"通知类型"},sendPeople:{rules:[{format:"string"}],title:"发送者",label:"发送者"},receive:{rules:[{required:!0},{format:"string"}],title:"接收者",label:"接收者"},message:{rules:[{format:"string"}],title:"消息",label:"消息"},otherMessage:{rules:[{format:"string"}],title:"其他消息",label:"其他消息"},status:{rules:[{format:"bool"}],title:"消息状态",defaultValue:!1,label:"消息状态"},create_date:{rules:[{format:"timestamp"}]}},t={};function l(e,t){let l={};for(let a in e){let{type:r,value:s}=e[a];switch(r){case"search":"string"==typeof s&&s.length&&(l[a]=new RegExp(s));break;case"select":if(s.length){let e=[];for(let l of s)e.push(t.eq(l));l[a]=t.or(e)}break;case"range":if(s.length){let e=s[0],r=s[1];l[a]=t.and([t.gte(e),t.lte(r)])}break;case"date":if(s.length){let[e,r]=s,i=new Date(e),n=new Date(r);l[a]=t.and([t.gte(i),t.lte(n)])}break;case"timestamp":if(s.length){let[e,r]=s;l[a]=t.and([t.gte(e),t.lte(r)])}}}return l}export{t as e,l as f,e as v};