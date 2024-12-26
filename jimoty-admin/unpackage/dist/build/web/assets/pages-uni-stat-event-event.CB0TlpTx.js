import{_ as e,Y as a,r as t,a as l,c as n,w as i,i as o,am as r,b as s,d,e as u,f as p,a5 as c,o as m,g as h,j as f,z as g,h as _,k as y,l as b,F as D,u as C,t as v}from"./index-DvwuWHCT.js";import{_ as q}from"./uni-stat-breadcrumb.1_qCubna.js";import{_ as x}from"./uni-link.CwV4A0M1.js";import{_ as V}from"./uni-data-select.B1sfxU-t.js";import{_ as k}from"./uni-stat-tabs.BdlunhUI.js";import{_ as T}from"./uni-easyinput.CI0qa16L.js";import{_ as w}from"./uni-pagination.DcoG_qbw.js";import{_ as z}from"./uni-popup-dialog.BXikTJNN.js";import{s as j,d as P,g as M,p as S,m as U}from"./util.Di6oEprN.js";import"./uni-tooltip.DLELLHps.js";const F=[{title:"创建时间",field:"create_time",tooltip:"",formatter:""},{title:"事件ID",field:"event_key",stat:-1},{title:"事件参数",field:"param",tooltip:""},{title:"平台",field:"platform",tooltip:""},{title:"设备标识",field:"device_id",tooltip:""}];const I=e({data:()=>({fieldsMap:F,formData:{event_key:"",device_id:""},query:{appid:"",platform_id:"",uni_platform:"",platform:"",channel_id:"",channel:"",version_id:"",version:"",create_time:[],event_key:"",device_id:""},options:{pageSize:20,pageCurrent:1,total:0},loading:!1,currentDateTab:1,tableData:[],panelData:[],queryId:"",updateValue:"",channelData:[],errorMessage:""}),computed:{channelQuery(){const e=this.query.platform_id;return j({platform_id:e})},versionQuery(){const{appid:e,uni_platform:a}=this.query;return j({appid:e,uni_platform:a})}},created(){this.debounceGet=P((()=>this.getAllData())),this.getChannelData()},watch:{query:{deep:!0,handler(e){this.options.pageCurrent=1,this.debounceGet()}}},methods:{changeFormData(e,a){this.query[a]=e},useDatetimePicker(){this.currentDateTab=-1},changeAppid(e){this.getChannelData(e,!1)},changeTimeRange(e,a){this.currentDateTab=a;const t=M(e),l=M(0)-1;this.query.create_time=[t,l]},changePageCurrent(e){this.options.pageCurrent=e.current,this.getTableData()},changePageSize(e){this.options.pageSize=e,this.options.pageCurrent=1,this.getTableData()},getAllData(e){this.getTableData(e)},changePlatform(e,a,t,l){this.getChannelData(null,e),this.query.version_id=0,this.query.uni_platform=l.code,this.query.platform=l.code},changeVersion(e){e||(e=""),e.split("---"),this.query.version=e.split("---")[0],this.query.platform=e.split("---")[1]},changeChannel(e){e||(e=""),e.split("---"),this.query.channel=e.split("---")[0]},getTableData(e=j(this.query,null,["uni_platform","platform_id","version_id","channel_id"])){if(!this.query.appid)return void(this.errorMessage="请先选择应用");this.errorMessage="";const{pageCurrent:t}=this.options;this.loading=!0;const l=a.database();let n=[l.collection("uni-stat-event-logs").where(e).getTemp(),l.collection("uni-stat-app-platforms").getTemp()];l.collection(...n).orderBy("create_time","desc").skip((t-1)*this.options.pageSize).limit(this.options.pageSize).get({getCount:!0}).then((e=>{const{count:a,data:t}=e.result;this.tableData=[],this.options.total=a;for(const l of t)l.create_time=S(l.create_time,"dateTime"),l.platform=l.platform&&l.platform[0].name,U(F,l,l),this.tableData.push(l)})).catch((e=>{console.error(e)})).finally((()=>{this.loading=!1}))},getChannelData(e,t){if(!this.query.appid)return void(this.errorMessage="请先选择应用");this.errorMessage="",this.query.channel_id="";const l=a.database(),n={};(e=e||this.query.appid)&&(n.appid=e),(t=t||this.query.platform_id)&&(n.platform_id=t);let i=l.collection("uni-stat-app-platforms").field("_id, name").getTemp(),o=l.collection("uni-stat-app-channels").where(n).field("_id, channel_name, create_time, platform_id").getTemp();l.collection(o,i).orderBy("platform_id","asc").get().then((e=>{let a=e.result.data,t=[];if(a.length>0){let e;for(let l in a)e=a[l].channel_name?a[l].channel_name:"默认",a[l].platform_id.length>0&&(e=a[l].platform_id[0].name+"-"+e),t.push({value:a[l]._id,text:e})}this.channelData=t})).catch((e=>{console.error(e)})).finally((()=>{}))}}},[["render",function(e,a,j,P,M,S){const U=t(l("uni-stat-breadcrumb"),q),F=t(l("uni-link"),x),I=o,A=t(l("uni-data-select"),V),Q=t(l("uni-stat-tabs"),k),G=t(l("uni-datetime-picker"),r),B=C,N=t(l("uni-easyinput"),T),R=t(l("uni-th"),s),E=t(l("uni-tr"),d),L=t(l("uni-td"),u),O=t(l("uni-table"),p),Y=t(l("uni-pagination"),w),$=t(l("uni-popup-dialog"),z),H=t(l("uni-popup"),c);return m(),n(I,{class:"fix-top-window"},{default:i((()=>[h(I,{class:"uni-header"},{default:i((()=>[h(U,{class:"uni-stat-breadcrumb-on-phone"}),h(I,{class:"uni-group"},{default:i((()=>[h(I,{class:"uni-sub-title hide-on-phone"},{default:i((()=>[f("分析用户自定义事件 "),h(F,{href:"https://ask.dcloud.net.cn/article/36304",text:"自定义事件说明>>"})])),_:1})])),_:1})])),_:1}),h(I,{class:"uni-container"},{default:i((()=>[h(I,{class:"uni-stat--x flex p-1015"},{default:i((()=>[h(I,{class:"uni-stat--app-select"},{default:i((()=>[h(A,{collection:"opendb-app-list",field:"appid as value, name as text",orderby:"text asc",defItem:1,label:"应用选择",modelValue:M.query.appid,"onUpdate:modelValue":a[0]||(a[0]=e=>M.query.appid=e),clear:!1},null,8,["modelValue"]),h(A,{collection:"opendb-app-versions",where:S.versionQuery,class:"ml-m",field:"concat(version, '---',uni_platform) as value, version as text, uni_platform as label, create_date as date",format:"{label} - {text}",orderby:"date desc",label:"版本选择",modelValue:M.query.version_id,"onUpdate:modelValue":a[1]||(a[1]=e=>M.query.version_id=e),onChange:S.changeVersion},null,8,["where","modelValue","onChange"])])),_:1})])),_:1}),h(I,{class:"uni-stat--x flex"},{default:i((()=>[h(Q,{label:"日期选择",current:M.currentDateTab,mode:"date",onChange:S.changeTimeRange},null,8,["current","onChange"]),h(G,{type:"datetimerange",end:(new Date).getTime(),modelValue:M.query.create_time,"onUpdate:modelValue":a[2]||(a[2]=e=>M.query.create_time=e),returnType:"timestamp",clearIcon:!1,class:g(["uni-stat-datetime-picker",{"uni-stat__actived":M.currentDateTab<0&&!!M.query.create_time.length}]),onChange:S.useDatetimePicker},null,8,["end","modelValue","class","onChange"])])),_:1}),h(I,{class:"uni-stat--x"},{default:i((()=>[h(Q,{label:"平台选择",type:"boldLine",mode:"platform",modelValue:M.query.platform_id,"onUpdate:modelValue":a[3]||(a[3]=e=>M.query.platform_id=e),onChange:S.changePlatform},null,8,["modelValue","onChange"]),M.query.platform_id&&-1===M.query.platform_id.indexOf("==")?(m(),n(A,{key:0,ref:"version-select",collection:"uni-stat-app-channels",where:S.channelQuery,class:"p-channel",field:"concat(channel_code, '---',channel_name) as value,  channel_name as text",orderby:"text asc",label:"渠道/场景值选择",modelValue:M.query.channel_id,"onUpdate:modelValue":a[4]||(a[4]=e=>M.query.channel_id=e),onChange:S.changeChannel},null,8,["where","modelValue","onChange"])):_("",!0)])),_:1}),h(I,{class:"uni-stat--x",style:{display:"flex","align-items":"center",padding:"10px"}},{default:i((()=>[h(B,{style:{width:"80px"}},{default:i((()=>[f("事件ID")])),_:1}),h(I,{style:{width:"300px"}},{default:i((()=>[h(N,{modelValue:M.formData.event_key,"onUpdate:modelValue":a[5]||(a[5]=e=>M.formData.event_key=e),placeholder:"事件ID",onChange:a[6]||(a[6]=e=>S.changeFormData(e,"event_key")),onClear:a[7]||(a[7]=e=>S.changeFormData("","event_key"))},null,8,["modelValue"])])),_:1}),h(B,{style:{width:"80px","margin-left":"10px"}},{default:i((()=>[f("设备标识")])),_:1}),h(I,{style:{width:"300px"}},{default:i((()=>[h(N,{modelValue:M.formData.device_id,"onUpdate:modelValue":a[8]||(a[8]=e=>M.formData.device_id=e),placeholder:"设备标识",onChange:a[9]||(a[9]=e=>S.changeFormData(e,"device_id")),onClear:a[10]||(a[10]=e=>S.changeFormData("","device_id"))},null,8,["modelValue"])])),_:1})])),_:1}),h(I,{class:"uni-stat--x p-m"},{default:i((()=>[h(O,{loading:M.loading,border:"",stripe:"",emptyText:M.errorMessage||e.$t("common.empty")},{default:i((()=>[h(E,null,{default:i((()=>[(m(!0),y(D,null,b(M.fieldsMap,((e,a)=>(m(),y(D,{key:a},[e.title?(m(),n(R,{key:a,align:"center"},{default:i((()=>[f(v(e.title),1)])),_:2},1024)):_("",!0)],64)))),128))])),_:1}),(m(!0),y(D,null,b(M.tableData,((e,a)=>(m(),n(E,{key:a},{default:i((()=>[(m(!0),y(D,null,b(M.fieldsMap,((a,t)=>(m(),n(L,{align:"center",key:t},{default:i((()=>[f(v(void 0!==e[a.field]?e[a.field]:"-"),1)])),_:2},1024)))),128))])),_:2},1024)))),128))])),_:1},8,["loading","emptyText"]),h(I,{class:"uni-pagination-box"},{default:i((()=>[h(Y,{"show-icon":"","show-page-size":"","page-size":M.options.pageSize,current:M.options.pageCurrent,total:M.options.total,onChange:S.changePageCurrent,onPageSizeChange:S.changePageSize},null,8,["page-size","current","total","onChange","onPageSizeChange"])])),_:1})])),_:1})])),_:1}),h(H,{ref:"inputDialog",type:"dialog",maskClick:!0},{default:i((()=>[h($,{ref:"inputClose",mode:"input",title:"请编辑名称",modelValue:M.updateValue,"onUpdate:modelValue":a[11]||(a[11]=e=>M.updateValue=e),placeholder:"请输入内容",onConfirm:e.editName},null,8,["modelValue","onConfirm"])])),_:1},512)])),_:1})}],["__scopeId","data-v-77c2287e"]]);export{I as default};
