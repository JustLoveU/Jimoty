const e={user_id:{rules:[{format:"string"}],title:"用户ID",defaultValue:{$env:"uid"},label:"用户ID"},total_fee:{rules:[{format:"int"}],title:"订单总金额",label:"订单总金额"},custom:{rules:[{format:"object"}],title:"自定义数据",label:"自定义数据"},order_no:{rules:[{format:"string"},{minLength:20,maxLength:28}],title:"业务系统订单号",label:"业务系统订单号"},type:{rules:[{format:"string"}],title:"订单类型",label:"订单类型"},status:{rules:[{format:"int"},{range:[{text:"已关闭",value:-1},{text:"未支付",value:0},{text:"已支付",value:1},{text:"已部分退款",value:2},{text:"已全额退款",value:3}]}],title:"订单状态",defaultValue:0,label:"订单状态"},create_date:{rules:[{format:"timestamp"}],title:"创建时间",label:"创建时间"},pay_date:{rules:[{format:"timestamp"}],title:"支付时间",label:"支付时间"}},t={status_valuetotext:{0:"未支付",1:"已支付",2:"已部分退款",3:"已全额退款","-1":"已关闭"}};function l(e,t){let l={};for(let a in e){let{type:r,value:s}=e[a];switch(r){case"search":"string"==typeof s&&s.length&&(l[a]=new RegExp(s));break;case"select":if(s.length){let e=[];for(let l of s)e.push(t.eq(l));l[a]=t.or(e)}break;case"range":if(s.length){let e=s[0],r=s[1];l[a]=t.and([t.gte(e),t.lte(r)])}break;case"date":if(s.length){let[e,r]=s,n=new Date(e),i=new Date(r);l[a]=t.and([t.gte(n),t.lte(i)])}break;case"timestamp":if(s.length){let[e,r]=s;l[a]=t.and([t.gte(e),t.lte(r)])}}}return l}export{t as e,l as f,e as v};
