const e={chatBoxId:{rules:[{required:!0},{format:"string"}],title:"消息框id",label:"消息框id"},userId:{rules:[{required:!0},{format:"string"}],title:"消息发送方",label:"消息发送方"},friendId:{rules:[{required:!0},{format:"string"}],title:"消息接收方",label:"消息接收方"},status:{rules:[{format:"bool"}],title:"是否已读",label:"是否已读"},message:{rules:[{format:"string"}],title:"消息内容",label:"消息内容"},type:{rules:[{format:"int"}],title:"消息类型",label:"消息类型"},delete:{rules:[{format:"bool"}],title:"是否删除",label:"是否删除"},time:{rules:[{format:"timestamp"}],title:"消息创建时间",label:"消息创建时间"}},t={};function l(e,t){let l={};for(let a in e){let{type:r,value:s}=e[a];switch(r){case"search":"string"==typeof s&&s.length&&(l[a]=new RegExp(s));break;case"select":if(s.length){let e=[];for(let l of s)e.push(t.eq(l));l[a]=t.or(e)}break;case"range":if(s.length){let e=s[0],r=s[1];l[a]=t.and([t.gte(e),t.lte(r)])}break;case"date":if(s.length){let[e,r]=s,i=new Date(e),n=new Date(r);l[a]=t.and([t.gte(i),t.lte(n)])}break;case"timestamp":if(s.length){let[e,r]=s;l[a]=t.and([t.gte(e),t.lte(r)])}}}return l}export{t as e,l as f,e as v};