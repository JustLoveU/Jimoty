<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="daoUserId" label="道具所属者uid" required>
        <uni-easyinput placeholder="道具所属者uid，参考 uni-id-users 表" v-model="formData.daoUserId"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="daojuType" label="道具类型" required>
        <uni-easyinput placeholder="0置顶，1高亮，2刷新,3定期刷新" type="number" v-model="formData.daojuType"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="daojuNum" label="道具数量">
        <uni-easyinput placeholder="道具数量" type="number" v-model="formData.daojuNum"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="last_use_date" label="最后一次使用的时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.last_use_date"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="create_date" label="创建道具的时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.create_date"></uni-datetime-picker>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
          <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/jimoty-daoju.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'jimoty-daoju';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }

  

  export default {
    data() {
      let formData = {
        "daoUserId": "",
        "daojuType": null,
        "daojuNum": 0,
        "last_use_date": null,
        "create_date": null
      }
      return {
        formData,
        formOptions: {},
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onLoad(e) {
      if (e.id) {
        const id = e.id
        this.formDataId = id
        this.getDetail(id)
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
          uni.showToast({
            title: '修改成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).doc(id).field("daoUserId,daojuType,daojuNum,last_use_date,create_date").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
            
          }
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>
