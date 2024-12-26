<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="send_user_id" label="评论者的uid">
        <uni-easyinput placeholder="评论者的uid，参考 uni-id-users 表" v-model="formData.send_user_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="re_user_id" label="被评论者的uid" required>
        <uni-easyinput placeholder="被评论者的uid，参考 uni-id-users 表" v-model="formData.re_user_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="post_id" label="被评论的帖子" required>
        <uni-easyinput placeholder="被评论的帖子" v-model="formData.post_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="type" label="评论类型" required>
        <uni-easyinput placeholder="评论类型(0好评1一般2差评)" type="number" v-model="formData.type"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="content" label="评论内容" required>
        <uni-easyinput placeholder="评论内容" v-model="formData.content" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="read_over" label="是否已阅">
        <switch @change="binddata('read_over', $event.detail.value)" :checked="formData.read_over"></switch>
      </uni-forms-item>
      <uni-forms-item name="create_date" label="评论发表时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.create_date"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="publish_ip" label="">
        <uni-easyinput placeholder="评论发表时，客户端的 IP 地址" v-model="formData.publish_ip"></uni-easyinput>
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
  import { validator } from '../../js_sdk/validator/jimoty-comment.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'jimoty-comment';

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
        "send_user_id": "",
        "re_user_id": "",
        "post_id": "",
        "type": null,
        "content": "",
        "read_over": null,
        "create_date": null,
        "publish_ip": ""
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
