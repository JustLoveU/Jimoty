import{_ as e,at as t,o as r,c as a,w as s,j as h,t as f,u as o}from"./index-DvwuWHCT.js";const l=e({name:"uniDateformat",props:{date:{type:[Object,String,Number],default:()=>"-"},locale:{type:String,default:"zh"},threshold:{type:Array,default:()=>[0,0]},format:{type:String,default:"yyyy/MM/dd hh:mm:ss"},refreshRate:{type:[Number,String],default:0}},data:()=>({refreshMark:0}),computed:{dateShow(){return this.refreshMark,t(this.date,{locale:this.locale,threshold:this.threshold,format:this.format})}},watch:{refreshRate:{handler(){this.setAutoRefresh()},immediate:!0}},methods:{refresh(){this.refreshMark++},setAutoRefresh(){clearInterval(this.refreshInterval),this.refreshRate&&(this.refreshInterval=setInterval((()=>{this.refresh()}),parseInt(this.refreshRate)))}}},[["render",function(e,t,l,d,i,n){const u=o;return r(),a(u,null,{default:s((()=>[h(f(n.dateShow),1)])),_:1})}]]);export{l as _};
