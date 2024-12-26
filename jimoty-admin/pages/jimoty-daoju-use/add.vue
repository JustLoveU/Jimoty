<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="daojuUserId" label="道具使用者" required>
        <uni-easyinput placeholder="道具使用者" v-model="formData.daojuUserId"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="daojuPostId" label="被使用的投稿" required>
        <uni-easyinput placeholder="被使用的投稿" v-model="formData.daojuPostId"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="daojuType" label="道具类型">
        <uni-easyinput placeholder="0置顶，1高亮，2刷新,3定期刷新" type="number" v-model="formData.daojuType"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="end_date" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.end_date"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="delete" label="">
        <switch @change="binddata('delete', $event.detail.value)" :checked="formData.delete"></switch>
      </uni-forms-item>
      <uni-forms-item name="create_date" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.create_date"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="update_date" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.update_date"></uni-datetime-picker>
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
  import { validator } from '../../js_sdk/validator/jimoty-daoju-use.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'jimoty-daoju-use';

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
        "daojuUserId": "",
        "daojuPostId": "",
        "daojuType": null,
        "end_date": null,
        "delete": false,
        "create_date": null,
        "update_date": null
      }
      return {
        formData,
        formOptions: {},
        rules: {
          ...getValidator(Object.keys(formData))
        }
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
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>
