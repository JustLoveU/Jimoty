<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="user_id" label="用户ID">
        <uni-easyinput placeholder="用户id，参考uni-id-users表" v-model="formData.user_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="total_fee" label="订单总金额">
        <uni-easyinput placeholder="订单总金额，单位为分，100等于1元" type="number" v-model="formData.total_fee"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="custom" label="自定义数据">
        <undefined v-model="formData.custom"></undefined>
      </uni-forms-item>
      <uni-forms-item name="order_no" label="业务系统订单号">
        <uni-easyinput placeholder="业务系统订单号，控制在20-28位（不可以是24位,24位在阿里云空间可能会有问题，可重复，代表1个业务订单会有多次付款的情况）" v-model="formData.order_no" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="type" label="订单类型">
        <uni-easyinput placeholder="订单类型 test：订单付款  等等，可自定义" v-model="formData.type" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="status" label="订单状态">
        <uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="create_date" label="创建时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.create_date"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="pay_date" label="支付时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.pay_date"></uni-datetime-picker>
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
  import { validator } from '../../js_sdk/validator/jimoty-pay-order.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'jimoty-pay-order';

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
        "user_id": "",
        "total_fee": null,
        "custom": null,
        "order_no": "",
        "type": "",
        "status": 0,
        "create_date": null,
        "pay_date": null
      }
      return {
        formData,
        formOptions: {
          "status_localdata": [
            {
              "text": "已关闭",
              "value": -1
            },
            {
              "text": "未支付",
              "value": 0
            },
            {
              "text": "已支付",
              "value": 1
            },
            {
              "text": "已部分退款",
              "value": 2
            },
            {
              "text": "已全额退款",
              "value": 3
            }
          ]
        },
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
        db.collection(dbCollectionName).doc(id).field("user_id,total_fee,custom,order_no,type,status,create_date,pay_date").get().then((res) => {
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
