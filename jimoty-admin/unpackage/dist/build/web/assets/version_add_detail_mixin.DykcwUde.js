import{Y as t,p as e,$ as a,x as i}from"./index-DvwuWHCT.js";import{e as s,v as r}from"./utils.Q-CcPd_g.js";const l=t.database();function n(t){let e={};for(let a in r)t.includes(a)&&(e[a]=r[a]);return e}const o="appid,name,title,contents,platform,type,version,min_uni_version,url,stable_publish,is_silently,is_mandatory,create_date,store_list",p={data:()=>({labelWidth:"100px",enableiOSWgt:!0,silentlyContent:"静默更新：App升级时会在后台下载wgt包并自行安装。新功能在下次启动App时生效",mandatoryContent:"强制更新：App升级弹出框不可取消",stablePublishContent:"同时只可有一个线上发行版，线上发行不可更设为下线。\n未上线可以设为上线发行并自动替换当前线上发行版",stablePublishContent2:"使用本包替换当前线上发行版",uploadFileContent:"可下载安装包地址。上传文件到云存储自动填写，也可以手动填写",minUniVersionContent:"上次使用新Api或打包新模块的App版本",priorityContent:"检查更新时，按照优先级从大到小依次尝试跳转商店。如果都跳转失败，则会打开浏览器使用下载链接下载apk安装包",latestStableData:[],appFileList:null,type_valuetotext:s.type_valuetotext,preUrl:"",formData:{appid:"",name:"",title:"",contents:"",platform:[],store_list:[],type:"",version:"",min_uni_version:"",url:"",stable_publish:!1,create_date:null},formOptions:{platform_localdata:[{value:"Android",text:"安卓"},{value:"iOS",text:"苹果"}],type_localdata:[{value:"native_app",text:"原生App安装包"},{value:"wgt",text:"App资源包"}]},rules:{...n(["appid","contents","platform","type","version","min_uni_version","url","stable_publish","title","name","is_silently","is_mandatory","store_list"])}}),onReady(){this.$refs.form.setRules(this.rules)},computed:{isWGT(){return"wgt"===this.formData.type},isiOS(){return!this.isWGT&&this.formData.platform.includes("iOS")},hasPackage(){return this.appFileList&&!!Object.keys(this.appFileList).length},fileExtname(){return this.isWGT?["wgt"]:["apk"]},platformLocaldata(){return this.isWGT?this.enableiOSWgt?this.formOptions.platform_localdata:[this.formOptions.platform_localdata[0]]:this.formOptions.platform_localdata},uni_platform(){return(this.isiOS?"iOS":"Android").toLocaleLowerCase()}},methods:{getStoreList:t=>l.collection("opendb-app-list").where({appid:t}).get().then((t=>{const e=t.result.data[0];return e&&e.store_list||[]})),packageUploadSuccess(t){e({icon:"success",title:"上传成功",duration:800}),this.preUrl=this.formData.url,this.formData.url=t.tempFilePaths[0]},deleteFile(t){return this.$request("deleteFile",{fileList:t},{functionName:"uni-upgrade-center"})},async packageDelete(t){this.hasPackage&&(await this.deleteFile([t.tempFilePath]),e({icon:"success",title:"删除成功",duration:800}),this.formData.url=this.preUrl,this.$refs.form.clearValidate("url"))},selectFile(){this.hasPackage&&e({icon:"none",title:"只可上传一个文件，请删除已上传后重试",duration:1e3})},createCenterRecord(t){return{...t,uni_platform:this.uni_platform,create_env:"upgrade-center"}},createCenterQuery:({appid:t})=>({appid:t,create_env:"upgrade-center"}),createStatQuery({appid:t,type:e,version:a,uni_platform:i}){return{appid:t,type:e,version:a,uni_platform:i||this.uni_platform,create_env:"uni-stat",stable_publish:!1}},toUrl(t){window.open(t)},getCloudStorageConfig:()=>a("uni-admin-cloud-storage-config")||{},setCloudStorageConfig(t={}){i("uni-admin-cloud-storage-config",t)},setCloudStorage(e){"function"==typeof t.setCloudStorage&&t.setCloudStorage(e)}}};export{p as a,o as f};
