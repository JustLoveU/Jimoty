import{_ as e,Y as t,M as a,N as l,s as i,p as o,G as s,r as n,a as r,c as d,w as u,i as m,o as c,g as f,j as p,t as h,h as _,k as b,l as g,F as y,O as x,P as k,Q as D,u as V,R as v,T as C,m as S,U as P,V as F,W as U,X as w}from"./index-DvwuWHCT.js";import{_ as W}from"./uni-easyinput.CI0qa16L.js";import{_ as T}from"./uni-forms-item.D9H7wr3d.js";import{_ as G}from"./uni-data-checkbox.CVdOplTL.js";import{_ as j,a as O,b as z}from"./uni-card.B986LF9N.js";import{_ as I}from"./uni-forms.IzwqOl-w.js";import{a as q,f as L}from"./version_add_detail_mixin.DykcwUde.js";import{a as A}from"./utils.Q-CcPd_g.js";import"./uni-load-more.BsuNNNgF.js";const E=t.database();E.command;const N=A;const $=e({mixins:[q],data:()=>({latestVersion:"0.0.0",lastVersionId:"",uniFilePickerProvider:"unicloud",domain:""}),async onLoad({appid:e,name:t,type:a}){let{domain:l,provider:i}=this.getCloudStorageConfig();if(l&&(this.domain=l),i&&(this.uniFilePickerProvider=i),e&&a&&t){const l=await this.getStoreList(e);this.formData={...this.formData,appid:e,name:t,type:a,store_list:l},this.latestStableData=await this.getDetail(e,a),!this.isWGT&&this.latestStableData.length&&this.setFormData("Android"),this.isWGT&&this.rules.min_uni_version.rules.push({required:!0})}},onUnload(){this.setCloudStorage({provider:null})},watch:{isiOS(e){e||!this.hasPackage?this.formData.url="":this.formData.url=this.appFileList.url},"formData.platform"(e){this.setFormData(e)},domain(e){this.setCloudStorage({domain:e}),this.formData.url&&(e||(e="请输入自定义域名"),this.formData.url=this.formData.url.replace(/^(https?:\/\/)[^\/]+/,`$1${e}`))},uniFilePickerProvider:{immediate:!0,handler(e){this.setCloudStorage({provider:e})}}},methods:{setFormData(e){a({mask:!0}),this.latestVersion="0.0.0",this.lastVersionId="";const t=this.getData(this.latestStableData,e)[0];if(t){const{_id:e,version:a,name:l,platform:i,min_uni_version:o,url:s}=t;this.lastVersionId=e,this.latestVersion=a,this.formData.name=l,this.isWGT?this.formData.min_uni_version=o:(delete this.formData.min_uni_version,this.formData.platform=i[0],this.isiOS&&(this.formData.url=s))}else this.isWGT&&(this.formData.min_uni_version="");l()},submit(){a({mask:!0}),this.$refs.form.validate(["store_list"]).then((e=>{if(function(e="0",t="0"){e=String(e).split("."),t=String(t).split(".");const a=Math.min(e.length,t.length);let l=0;for(let i=0;i<a;i++){const a=Number(e[i]),o=Number(t[i]);if(a>o){l=1;break}if(a<o){l=-1;break}}if(0===l&&e.length!==t.length){const i=e.length>t.length,o=i?e:t;for(let e=a;e<o.length;e++)if(Number(o[e])>0){l=i?1:-1;break}}return l}(this.latestVersion,e.version)>=0)throw i({content:`版本号必须大于当前已上线版本（${this.latestVersion}）`,showCancel:!1}),new Error("版本号必须大于已上线版本（${this.latestVersion}）");this.isWGT||(e.platform=[e.platform]),(this.isiOS||this.isWGT)&&delete e.store_list,e.store_list&&e.store_list.forEach((e=>{e.priority=parseFloat(e.priority)})),this.submitForm(e)})).catch((e=>{l()}))},async submitForm(e){e=this.createCenterRecord(e);const t=E.collection(N);let a,n=[];this.isWGT||(n=await this.getDetail(e.appid,e.type,this.createStatQuery(e))),n.length?(e.create_date=Date.now(),a=t.doc(n[0]._id).update(e)):a=t.add(e),a.then((async a=>{e.stable_publish&&this.lastVersionId&&await t.doc(this.lastVersionId).update({stable_publish:!1}),o({title:"新增成功"}),this.getOpenerEventChannel().emit("refreshData"),setTimeout((()=>s()),500)})).catch((e=>{i({content:e.message||"请求服务失败",showCancel:!1})})).finally((()=>{l()})),this.setCloudStorageConfig({provider:this.uniFilePickerProvider,domain:this.domain})},getDetail:(e,t,o={})=>(a({mask:!0}),E.collection(N).where(Object.assign({appid:e,type:t,stable_publish:!0},o)).field(L).get().then((e=>e.result.data)).catch((e=>{i({content:e.message||"请求服务失败",showCancel:!1})})).finally((()=>{l()}))),getData:(e=[],t)=>"string"==typeof t?e.filter((e=>e.platform.includes(t))):e.filter((e=>e.platform.toString()===t.toString())),back(){i({title:"取消发布",content:this.hasPackage?"将会删除已上传的包":void 0,success:e=>{e.confirm&&(this.hasPackage&&this.deleteFile([this.appFileList.url]),s())}})}}},[["render",function(e,t,a,l,i,o){const s=m,q=n(r("uni-easyinput"),W),L=n(r("uni-forms-item"),T),A=k,E=n(r("uni-data-checkbox"),G),N=n(r("show-info"),j),$=D,M=V,Q=v,R=C,H=S,X=n(r("uni-file-picker"),O),Y=U,B=w,J=n(r("uni-card"),z),K=P,Z=n(r("uni-forms"),I);return c(),d(s,{class:"uni-container"},{default:u((()=>[f(s,{class:"uni-header"},{default:u((()=>[f(s,{class:"uni-group"},{default:u((()=>[f(s,{class:"uni-title"},{default:u((()=>[p("包类型")])),_:1}),f(s,{class:"uni-sub-title"},{default:u((()=>[p(h(e.type_valuetotext[e.formData.type]),1)])),_:1})])),_:1})])),_:1}),f(Z,{ref:"form",value:e.formData,validateTrigger:"bind",labelWidth:e.labelWidth},{default:u((()=>[f(L,{name:"appid",label:"AppID",required:""},{default:u((()=>[f(q,{disabled:!0,modelValue:e.formData.appid,"onUpdate:modelValue":t[0]||(t[0]=t=>e.formData.appid=t),trim:"both"},null,8,["modelValue"])])),_:1}),f(L,{name:"name",label:"应用名称"},{default:u((()=>[f(q,{disabled:!0,modelValue:e.formData.name,"onUpdate:modelValue":t[1]||(t[1]=t=>e.formData.name=t),trim:"both"},null,8,["modelValue"])])),_:1}),f(L,{name:"title",label:"更新标题"},{default:u((()=>[f(q,{placeholder:"更新标题",modelValue:e.formData.title,"onUpdate:modelValue":t[2]||(t[2]=t=>e.formData.title=t)},null,8,["modelValue"])])),_:1}),f(L,{name:"contents",label:"更新内容",required:""},{default:u((()=>[f(A,{"auto-height":"",style:{"box-sizing":"content-box"},maxlength:-1,onInput:t[3]||(t[3]=t=>e.binddata("contents",t.detail.value)),class:"uni-textarea-border",value:e.formData.contents,"onUpdate:value":t[4]||(t[4]=t=>e.formData.contents=t)},null,8,["value"])])),_:1}),f(L,{name:"platform",label:"平台",required:""},{default:u((()=>[f(E,{multiple:e.isWGT,modelValue:e.formData.platform,"onUpdate:modelValue":t[5]||(t[5]=t=>e.formData.platform=t),localdata:e.platformLocaldata},null,8,["multiple","modelValue","localdata"])])),_:1}),f(L,{name:"version",label:"版本号",required:""},{default:u((()=>[f(q,{modelValue:e.formData.version,"onUpdate:modelValue":t[6]||(t[6]=t=>e.formData.version=t),placeholder:"当前包版本号，必须大于当前线上发行版本号"},null,8,["modelValue"])])),_:1}),e.isWGT?(c(),d(L,{key:"min_uni_version",name:"min_uni_version",label:"原生App最低版本",required:e.isWGT},{default:u((()=>[f(q,{placeholder:"原生App最低版本",modelValue:e.formData.min_uni_version,"onUpdate:modelValue":t[7]||(t[7]=t=>e.formData.min_uni_version=t)},null,8,["modelValue"]),f(N,{content:e.minUniVersionContent},null,8,["content"])])),_:1},8,["required"])):_("",!0),f(L,{label:"存储选择"},{default:u((()=>[f(s,{class:"flex"},{default:u((()=>[f(R,{onChange:t[8]||(t[8]=e=>i.uniFilePickerProvider=e.detail.value),style:{width:"100%"}},{default:u((()=>[f(s,{class:"flex",style:{"flex-wrap":"nowrap"}},{default:u((()=>[p(" 上传至： "),f(Q,null,{default:u((()=>[f($,{value:"unicloud",checked:"unicloud"===i.uniFilePickerProvider},null,8,["checked"]),f(M,null,{default:u((()=>[p("内置存储")])),_:1})])),_:1}),f(Q,{style:{"margin-left":"20rpx"}},{default:u((()=>[f($,{value:"extStorage",checked:"extStorage"===i.uniFilePickerProvider},null,8,["checked"]),f(M,null,{default:u((()=>[p("扩展存储")])),_:1})])),_:1})])),_:1})])),_:1}),f(M,{class:"uni-sub-title",style:{"margin-top":"10px","font-size":"12px",color:"#666",width:"100%"}},{default:u((()=>[p("内置存储是服务空间开通后自带的云存储，不支持自定义域名，不支持阶梯计费")])),_:1}),f(M,{class:"uni-sub-title",style:{"margin-top":"10px","font-size":"12px",color:"#666"}},{default:u((()=>[p("扩展存储支持自定义域名、阶梯计费，越用越便宜、功能更强大")])),_:1}),f(M,{class:"uni-sub-title",style:{"margin-top":"10px","font-size":"12px",color:"#2979ff",cursor:"pointer","text-decoration":"underline","margin-left":"10px"},onClick:t[9]||(t[9]=t=>e.toUrl("https://doc.dcloud.net.cn/uniCloud/ext-storage/service.html"))},{default:u((()=>[p("扩展存储开通文档")])),_:1})])),_:1})])),_:1}),"extStorage"===i.uniFilePickerProvider?(c(),d(L,{key:1,label:"自定义域名"},{default:u((()=>[f(s,{class:"flex",style:{"flex-direction":"column","align-items":"flex-start"}},{default:u((()=>[f(q,{placeholder:"请输入扩展存储自定义域名",modelValue:i.domain,"onUpdate:modelValue":t[10]||(t[10]=e=>i.domain=e),maxlength:-1,style:{width:"550px"}},null,8,["modelValue"]),f(M,{class:"uni-sub-title",style:{"margin-top":"10px","font-size":"12px",color:"#666"}},{default:u((()=>[p("输入扩展存储绑定的域名，在服务空间-云存储-扩展存储页面可查看，如：cdn.example.com")])),_:1})])),_:1})])),_:1})):_("",!0),e.isiOS?_("",!0):(c(),d(L,{key:2,label:"上传"+e.fileExtname[0]+"包"},{default:u((()=>[f(X,{modelValue:e.appFileList,"onUpdate:modelValue":t[11]||(t[11]=t=>e.appFileList=t),"file-extname":e.fileExtname,disabled:e.hasPackage,returnType:"object","file-mediatype":"all",limit:"1",onSuccess:e.packageUploadSuccess,provider:i.uniFilePickerProvider,onDelete:e.packageDelete},{default:u((()=>[f(s,{class:"flex"},{default:u((()=>[f(H,{type:"primary",size:"mini",onClick:e.selectFile,style:{margin:"0px"}},{default:u((()=>[p("选择文件")])),_:1},8,["onClick"])])),_:1}),f(s,{class:"flex"},{default:u((()=>[f(M,{style:{"margin-top":"10px","font-size":"12px",color:"#666"}},{default:u((()=>[p("上传"+h(e.fileExtname[0])+"到当前服务空间的云存储中，上传成功后，会自动使用云存储地址填充下载链接",1)])),_:1}),f(M,{style:{"margin-top":"10px","font-size":"12px",color:"#666"}},{default:u((()=>[p("上传文件后同步到各地cdn缓存节点有延迟。请适当等候再提交新版信息入库，触发客户端更新提示。")])),_:1})])),_:1})])),_:1},8,["modelValue","file-extname","disabled","onSuccess","provider","onDelete"]),e.hasPackage?(c(),d(M,{key:0,style:{"padding-left":"20px",color:"#a8a8a8"}},{default:u((()=>[p(h(Number(e.appFileList.size/1024/1024).toFixed(2))+"M",1)])),_:1})):_("",!0)])),_:1},8,["label"])),f(L,{key:"url",name:"url",label:e.isiOS?"AppStore":"下载链接",required:""},{default:u((()=>[f(s,{class:"flex",style:{"flex-direction":"column","align-items":"flex-start",flex:"1"}},{default:u((()=>[f(s,{class:"flex",style:{width:"100%"}},{default:u((()=>[f(q,{placeholder:"链接",modelValue:e.formData.url,"onUpdate:modelValue":t[12]||(t[12]=t=>e.formData.url=t),maxlength:-1},null,8,["modelValue"]),e.formData.url?(c(),d(M,{key:0,style:{"margin-left":"10px",color:"#2979ff",cursor:"pointer","text-decoration":"underline"},onClick:t[13]||(t[13]=t=>e.toUrl(e.formData.url))},{default:u((()=>[p("测试下载")])),_:1})):_("",!0)])),_:1}),e.formData.url?(c(),d(M,{key:0,style:{"margin-top":"10px","font-size":"12px",color:"#666"}},{default:u((()=>[p("建议点击【测试下载】能正常下载后，再进行发布")])),_:1})):_("",!0)])),_:1})])),_:1},8,["label"]),e.isiOS||e.isWGT||!e.formData.store_list.length?_("",!0):(c(),d(L,{label:"Android应用市场",labelWidth:"125px",key:"store_list",name:"store_list"},{default:u((()=>[f(s,{style:{flex:"1"}},{default:u((()=>[(c(!0),b(y,null,g(e.formData.store_list,(t=>(c(),d(s,{key:t.id},{default:u((()=>[f(J,{style:{margin:"0px 0px 20px 0px"}},{default:u((()=>[f(s,{style:{display:"flex"}},{default:u((()=>[f(B,{style:{"user-select":"none"},onChange:({detail:{value:e}})=>{t.enable=!!e.length}},{default:u((()=>[f(Q,{class:"title_padding"},{default:u((()=>[f(Y,{value:"scheme",checked:t.enable},null,8,["checked"]),f(M,null,{default:u((()=>[p("是否启用")])),_:1})])),_:2},1024)])),_:2},1032,["onChange"])])),_:2},1024),f(L,{label:"商店名称"},{default:u((()=>[f(q,{disabled:"",modelValue:t.name,"onUpdate:modelValue":e=>t.name=e,trim:"both"},null,8,["modelValue","onUpdate:modelValue"])])),_:2},1024),f(L,{label:"Scheme"},{default:u((()=>[f(q,{disabled:"",modelValue:t.scheme,"onUpdate:modelValue":e=>t.scheme=e,trim:"both"},null,8,["modelValue","onUpdate:modelValue"])])),_:2},1024),f(L,{label:"优先级"},{default:u((()=>[f(q,{modelValue:t.priority,"onUpdate:modelValue":e=>t.priority=e,type:"number"},null,8,["modelValue","onUpdate:modelValue"]),f(N,{top:-100,left:-180,content:e.priorityContent},null,8,["content"])])),_:2},1024)])),_:2},1024)])),_:2},1024)))),128))])),_:1})])),_:1})),e.isWGT?(c(),d(L,{key:"is_silently",name:"is_silently",label:"静默更新"},{default:u((()=>[f(K,{onChange:t[14]||(t[14]=t=>e.binddata("is_silently",t.detail.value)),checked:e.formData.is_silently},null,8,["checked"]),f(N,{top:-80,content:e.silentlyContent},null,8,["content"])])),_:1})):_("",!0),e.isiOS?_("",!0):(c(),d(L,{key:"is_mandatory",name:"is_mandatory",label:"强制更新"},{default:u((()=>[f(K,{onChange:t[15]||(t[15]=t=>e.binddata("is_mandatory",t.detail.value)),checked:e.formData.is_mandatory},null,8,["checked"]),f(N,{content:e.mandatoryContent},null,8,["content"])])),_:1})),f(L,{name:"stable_publish",label:"上线发行"},{default:u((()=>[f(K,{onChange:t[16]||(t[16]=t=>e.binddata("stable_publish",t.detail.value)),checked:e.formData.stable_publish},null,8,["checked"]),f(N,{top:-40,content:e.stablePublishContent2},null,8,["content"])])),_:1}),x(f(L,{name:"type",label:"安装包类型"},{default:u((()=>[f(E,{modelValue:e.formData.type,"onUpdate:modelValue":t[17]||(t[17]=t=>e.formData.type=t),localdata:e.formOptions.type_localdata},null,8,["modelValue","localdata"])])),_:1},512),[[F,!1]]),f(s,{class:"uni-button-group"},{default:u((()=>[f(H,{type:"primary",class:"uni-button",style:{width:"100px"},onClick:o.submit},{default:u((()=>[p("发布")])),_:1},8,["onClick"]),f(H,{type:"warn",class:"uni-button",style:{width:"100px","margin-left":"15px"},onClick:o.back},{default:u((()=>[p("取消")])),_:1},8,["onClick"])])),_:1})])),_:1},8,["value","labelWidth"])])),_:1})}],["__scopeId","data-v-863a940f"]]);export{$ as default};