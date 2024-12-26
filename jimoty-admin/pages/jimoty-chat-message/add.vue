<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="chatBoxId" label="消息框id" required>
        <uni-easyinput placeholder="消息所在的消息框" v-model="formData.chatBoxId"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="userId" label="消息发送方" required>
        <uni-easyinput placeholder="消息发送方 UserID（用于指定发送消息方帐号）" v-model="formData.userId"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="friendId" label="消息接收方" required>
        <uni-easyinput placeholder="消息接收方 UserID" v-model="formData.friendId"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="status" label="是否已读">
        <switch @change="binddata('status', $event.detail.value)" :checked="formData.status"></switch>
      </uni-forms-item>
      <uni-forms-item name="message" label="消息内容">
        <uni-easyinput placeholder="消息内容" v-model="formData.message"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="type" label="消息类型">
        <uni-easyinput placeholder="消息内容（0文字，1图片链接，2音频链接，3地图）" type="number" v-model="formData.type"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="delete" label="是否删除">
        <switch @change="binddata('delete', $event.detail.value)" :checked="formData.delete"></switch>
      </uni-forms-item>
      <uni-forms-item name="time" label="消息创建时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.time"></uni-datetime-picker>
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
  import { validator } from '../../js_sdk/validator/jimoty-chat-message.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'jimoty-chat-message';

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
        "chatBoxId": "",
        "userId": "",
        "friendId": "",
        "status": null,
        "message": "",
        "type": null,
        "delete": null,
        "time": null
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
