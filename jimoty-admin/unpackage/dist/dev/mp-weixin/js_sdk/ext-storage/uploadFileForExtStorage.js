"use strict";
const common_vendor = require("../../common/vendor.js");
function init(options = {}) {
  let {
    provider: defaultProvider
  } = options;
  let originalDefaultProvider = defaultProvider;
  let extStorage = new ExtStorage(options);
  const uploadFile = common_vendor.Vs.uploadFile;
  common_vendor.Vs.uploadFile = (...e) => {
    let options2 = e[0] || {};
    let {
      provider = defaultProvider
    } = options2;
    if (provider === "extStorage") {
      return extStorage.uploadFile(...e);
    } else {
      return uploadFile(...e);
    }
  };
  const getTempFileURL = common_vendor.Vs.getTempFileURL;
  common_vendor.Vs.getTempFileURL = (...e) => {
    let options2 = e[0] || {};
    let {
      provider = defaultProvider
    } = options2;
    if (provider === "extStorage") {
      return extStorage.getTempFileURL(...e);
    } else {
      return getTempFileURL(...e);
    }
  };
  const deleteFile = common_vendor.Vs.deleteFile;
  common_vendor.Vs.deleteFile = (...e) => {
    let options2 = e[0] || {};
    let {
      provider = defaultProvider
    } = options2;
    if (provider === "extStorage") {
      return extStorage.deleteFile(...e);
    } else {
      return deleteFile(...e);
    }
  };
  common_vendor.Vs.setCloudStorage = (data = {}) => {
    let {
      provider,
      domain,
      fileID2fileURL
    } = data;
    if (provider === null) {
      defaultProvider = originalDefaultProvider;
    } else if (provider) {
      defaultProvider = provider;
    }
    if (domain)
      extStorage.domain = domain;
    if (fileID2fileURL)
      extStorage.fileID2fileURL = fileID2fileURL;
  };
}
const uploadFileForExtStorage = {
  init
};
class ExtStorage {
  constructor(data = {}) {
    let {
      uploadFileOptions,
      domain,
      fileID2fileURL
    } = data;
    this.uploadFileOptions = uploadFileOptions;
    this.domain = domain;
    this.fileID2fileURL = fileID2fileURL;
  }
  // 上传文件
  uploadFile(options) {
    let {
      filePath,
      cloudPath
    } = options;
    const promiseRes = new Promise(async (resolve, reject) => {
      try {
        const uploadFileOptionsRes = await this.uploadFileOptions({
          cloudPath,
          domain: this.domain
        });
        const uploadTask = common_vendor.index.uploadFile({
          ...uploadFileOptionsRes.uploadFileOptions,
          // 上传文件所需参数
          filePath,
          // 本地文件路径
          success: (uploadFileRes) => {
            if (uploadFileRes.statusCode !== 200) {
              const err = uploadFileRes;
              if (typeof options.fail === "function")
                options.fail(err);
              reject(err);
            } else {
              const res = {
                cloudPath: uploadFileOptionsRes.cloudPath,
                // 文件云端路径
                fileID: uploadFileOptionsRes.fileID,
                // 文件ID
                fileURL: uploadFileOptionsRes.fileURL
                // 文件URL（如果是私有权限，则此URL是无法直接访问的）
              };
              if (this.fileID2fileURL) {
                res.fileID = `https://${this.domain}/${res.cloudPath}`;
              }
              if (typeof options.success === "function")
                options.success(res);
              resolve(res);
            }
          },
          fail: (err) => {
            if (typeof options.fail === "function")
              options.fail(err);
            reject(err);
          },
          complete: () => {
            if (typeof options.complete === "function")
              options.complete();
          }
        });
        uploadTask.onProgressUpdate((progressEvent) => {
          if (typeof options.onUploadProgress === "function") {
            const total = progressEvent.totalBytesExpectedToSend;
            const loaded = progressEvent.totalBytesSent;
            const progress = Math.round(loaded * 100 / total);
            options.onUploadProgress({
              total,
              loaded,
              progress
            });
          }
        });
      } catch (err) {
        if (typeof options.fail === "function")
          options.fail(err);
        reject(err);
        if (typeof options.complete === "function")
          options.complete();
      }
    });
    promiseRes.catch(() => {
    });
    return promiseRes;
  }
  // 获取临时文件下载地址
  getTempFileURL(options = {}) {
    let {
      fileList
    } = options;
    return new Promise((resolve, reject) => {
      let res = {
        fileList: fileList.map((item, index) => {
          let cloudPath = getCloudPath(item);
          return {
            fileID: item,
            tempFileURL: `https://${this.domain}/${cloudPath}`
          };
        })
      };
      if (typeof options.success === "function")
        options.success(res);
      resolve(res);
      if (typeof options.complete === "function")
        options.complete();
    });
  }
  // 删除文件
  deleteFile(options = {}) {
    return new Promise((resolve, reject) => {
      let res = {
        fileList: []
      };
      if (typeof options.success === "function")
        options.success(res);
      resolve(res);
      if (typeof options.complete === "function")
        options.complete();
    });
  }
}
function getCloudPath(cloudPath) {
  const qiniuPrefix = "qiniu://";
  if (cloudPath.indexOf(qiniuPrefix) === 0) {
    cloudPath = cloudPath.substring(qiniuPrefix.length);
  } else if (cloudPath.indexOf("http://") === 0 || cloudPath.indexOf("https://") === 0) {
    let startIndex = cloudPath.indexOf("://") + 3;
    startIndex = cloudPath.indexOf("/", startIndex);
    let endIndex = cloudPath.indexOf("?") === -1 ? cloudPath.length : cloudPath.indexOf("?");
    endIndex = cloudPath.indexOf("#") !== -1 && cloudPath.indexOf("#") < endIndex ? cloudPath.indexOf("#") : endIndex;
    cloudPath = cloudPath.substring(startIndex + 1, endIndex);
  }
  return cloudPath;
}
exports.uploadFileForExtStorage = uploadFileForExtStorage;
