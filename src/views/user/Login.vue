<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" :tab="$t('user.login.tab-login-credentials')">
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="$t('user.login.message-invalid-credentials')" />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              :placeholder="$t('user.login.username.placeholder')"
              v-decorator="[
                'username',
                {rules: [{ required: true, message: $t('user.userName.required') }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              :placeholder="$t('user.login.password.placeholder')"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: $t('user.password.required') }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="tab2" :tab="$t('user.login.tab-login-mobile')">
          <a-form-item>
            <a-input size="large" type="text" :placeholder="$t('user.login.mobile.placeholder')" v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: $t('user.login.mobile.placeholder') }], validateTrigger: 'change'}]">
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input size="large" type="text" :placeholder="$t('user.login.mobile.verification-code.placeholder')" v-decorator="['captcha', {rules: [{ required: true, message: $t('user.verification-code.required') }], validateTrigger: 'blur'}]">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && $t('user.register.get-verification-code') || (state.time+' s')"
              ></a-button>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <!-- <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">{{ $t('user.login.remember-me') }}</a-checkbox> -->
        <a href="/forget-password" style="float: right;" target="_blank">忘记密码</a>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >{{ $t('user.login.login') }}</a-button>
      </a-form-item>

      <!-- <div class="user-login-other">
        <span>{{ $t('user.login.sign-in-with') }}</span>
        <a>
          <a-icon class="item-icon" type="alipay-circle"></a-icon>
        </a>
        <a>
          <a-icon class="item-icon" type="taobao-circle"></a-icon>
        </a>
        <a>
          <a-icon class="item-icon" type="weibo-circle"></a-icon>
        </a>
        <router-link class="register" :to="{ name: 'register' }">{{ $t('user.login.signup') }}</router-link>
      </div> -->
    </a-form>
    <!-- 修改个人信息弹窗 -->
    <!-- <a-button @click="openmodal">点击</a-button> -->
    <a-modal
      v-model="visible"
      title="首次登录请修改用户信息"
      @ok="handleOk"
      @cancel="handleOff"
      destroyOnClose
      :maskClosable="false"
    >
      <a-form-model ref="ruleForm" :model="formdata" :rules="info_rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="证件类型" prop="idType">
          <a-select v-model="formdata.idType" placeholder="请选择证件类型">
            <a-select-option v-for="(item,index) in arr_idType" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="证件号" ref="idNo" prop="idNo">
          <a-input v-model="formdata.idNo"/>
        </a-form-model-item>
        <a-form-model-item label="姓名" ref="name" prop="name">
          <a-input v-model="formdata.name"/>
        </a-form-model-item>
        <a-form-model-item label="电话号码" ref="telephone" prop="telephone">
          <a-input v-model="formdata.telephone"/>
        </a-form-model-item>
        <a-form-model-item label="验证码" ref="code" prop="code">
          <a-input style="width: 65%;" v-model="formdata.code"/>
          <a-button v-if="codeShow" style="width: 35%;" @click="getUserCode(formdata.telephone)">{{ codebtnWord }}</a-button>
          <a-button :disabled="!codeShow" v-if="!codeShow" style="width: 35%;" @click="getUserCode(formdata.telephone)">{{ count }}秒后重试</a-button>
        </a-form-model-item>
        <a-form-model-item label="新密码" ref="oldPassword" prop="oldPassword">
          <a-input-password v-model="formdata.oldPassword"/>
        </a-form-model-item>
        <a-form-model-item label="再次输入密码" ref="newPassword" prop="newPassword">
          <a-input-password v-model="formdata.newPassword"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
  </div>
</template>

<script>
// import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getSmsCaptcha, get2step, getCode, UserMsg } from '@/api/login'

export default {
  components: {
    TwoStepCaptcha
  },
  data () {
    // 身份证校验
    var checkIdno = (rule, value, callback) => {
    if (value) {
        // 加权因子
        var weightfactor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        // 校验码
        var checkcode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
        var code = value + ''
        var last = value[17] // 最后一个
        var seventeen = code.substring(0, 17)
        // 判断最后一位校验码是否正确
        var arr = seventeen.split('')
        var len = arr.length
        var num = 0
        for (var i = 0; i < len; i++) {
          num = num + arr[i] * weightfactor[i]
        }
        // 获取余数
        var resisue = num % 11
        var lastno = checkcode[resisue]
        // 正则判断
        var idcardpatter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
        // 判断格式是否正确
        var format = idcardpatter.test(value)
        // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
        var idCode = last === lastno && format ? 1 : false
        // 根据结果判断
        if (!idCode) {
          // console.log('>>>>>>>', idCode)
          callback(new Error('输入证件号有误'))
        } else {
          callback()
        }
      } else if (!value) {
        callback(new Error('请输入证件号'))
      }
    }
    return {
      // 验证码
      codebtnWord: '获取验证码', // 获取验证码按钮文字
      codeShow: true,
      count: '', // 刷新秒数提示
      timer: null,
      // 表单样式
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      visible: false, // 弹窗判断
      CODE: 200,
      // 弹窗表单数据
      formdata: {
        idType: '', // 证件类型
        idNo: '', // 证据号码
        name: '', // 姓名
        telephone: '', // 电话
        code: '', // 验证码
        oldPassword: '', // 旧密码
        newPassword: '', // 新密码
        token: ''
      },
      // 证件类型
      arr_idType: [
         '居民身份证', '居民户口簿', '护照', '军官证', '驾驶证', '港涣居民来往内地通行证', '台湾居民来往内地通行证', '其他法定有效证件'
      ],
      // 用户信息规则
      info_rules: {
        idType: [
          { required: true, message: '请选择证件类型', trigger: 'blur' }
        ],
        idNo: [
           { required: true, message: '请输入证件号码', trigger: 'blur' },
          //  { min: 15, max: 18, message: '请输入正确的证件号码', trigger: 'blur' },
          //  { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的证件号码' },
           { validator: checkIdno, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        code: [
           { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { len: 11, message: '请输入正确的电话号码' },
          { pattern: /^[1][34578][0-9]{9}$/, message: '请输入正确的电话号码' }
        ],
        oldPassword: [
           { required: true, message: '请输入密码', trigger: 'blur' },
           { min: 8, message: '密码长度至少8位', trigger: 'blur' },
           { max: 16, message: '密码长度最高16位', trigger: 'blur' },
           { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, message: '密码需包含大写字母,小写字母和数字' }
        ],
        newPassword: [
           { required: true, message: '请再次输入密码', trigger: 'blur' },
           { min: 8, message: '密码长度至少8位', trigger: 'blur' },
           { max: 16, message: '密码长度最高16位', trigger: 'blur' },
           { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, message: '密码需包含大写字母,小写字母和数字' }
        ]
      },
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  created () {
    get2step({ })
      .then(res => {
        this.requiredTwoStepCaptcha = res.result.stepCode
      })
      .catch(() => {
        this.requiredTwoStepCaptcha = false
      })
    // this.requiredTwoStepCaptcha = true
  },
  methods: {
    // 获取验证码
    getUserCode (i) {
      var Reg = /^[1][34578][0-9]{9}$/
      // 满足规则获取
      if (Reg.test(this.formdata.telephone)) {
        // 获取验证码
        getCode(i).then(res => {
        // console.log(res)
        if (res.status === 200) {
          this.$message.info('验证码发送成功')
          // console.log(res.data.token)
          this.formdata.token = res.data.token // 保存token到data中
          // 60秒刷新
          const TIME_COUNT = 60
          if (!this.timer) {
            this.count = TIME_COUNT
            this.codeShow = false
            this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--
            } else {
              this.codeShow = true
              clearInterval(this.timer)
              this.timer = null
              }
            }, 1000)
          }
        } else if (res.status === 400) {
          this.$message.error(res.message || '获取验证码失败')
          const TIME_COUNT = 60
          if (!this.timer) {
            this.count = TIME_COUNT
            this.codeShow = false
            this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--
            } else {
              this.codeShow = true
              clearInterval(this.timer)
              this.timer = null
              }
            }, 1000)
          }
        } else {
          const TIME_COUNT = 60
          if (!this.timer) {
            this.count = TIME_COUNT
            this.codeShow = false
            this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--
            } else {
              this.codeShow = true
              clearInterval(this.timer)
              this.timer = null
              }
            }, 1000)
          }
          this.$message.error(res.message)
        }
      })
      } else {
        this.$message.info('输入的手机号格式不正确')
      }
    },
    // 触发弹窗
    openmodal () {
      this.visible = true
    },
    // 点击确定
    handleOk (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        // 满足校验规则提交
        if (valid) {
          // 判断密码是否相同且不为空
          if (this.formdata.newPassword === this.formdata.oldPassword && this.formdata.newPassword !== '' && this.formdata.oldPassword !== '') {
            // console.log('密码相同，可修改')
             UserMsg(this.formdata).then(res => {
              // console.log('成功'.res)
              // console.log('提交的信息', userinfo)
              if (res.status === 200) {
                  console.log('修改成功'.res)
                  const userinfo = this.formdata
                  this.$delete(userinfo, 'oldPassword')
                  this.$message.info('修改成功，请重新登陆')
                  // alert('修改成功，请重新登陆')
                  localStorage.removeItem('Authorization')
                  window.location.reload()// 刷新页面
                  this.visible = false
                } else {
                  this.$message.error(res.message || '修改失败')
                }
             })
          } else {
            this.$message.error('两次输入的密码不同,请修改')
          }
        } else {
          // 不满足规则
          this.$message.error('请按要求填写信息')
          return false
        }
      })
    },
    // 取消
    handleOff () {
      this.resetForm()
    },
    // 重置表单
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick (key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']

      validateFields([...validateFieldsKey, 'rememberMe'], { force: true }, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const loginParams = { ...values }
          delete loginParams.username
          loginParams[!state.loginType ? 'email' : 'username'] = values.username
          loginParams.password = values.password // md5(values.password)
          loginParams.rememberMe = !!values.rememberMe
          Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          getSmsCaptcha({ mobile: values.mobile }).then(res => {
            setTimeout(hide, 2500)
            this.$notification['success']({
              message: '提示',
              description: '验证码获取成功，您的验证码为：' + res.result.captcha,
              duration: 8
            })
          }).catch(err => {
            setTimeout(hide, 1)
            clearInterval(interval)
            state.time = 60
            state.smsSendBtn = false
            this.requestFailed(err)
          })
        }
      })
    },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res) {
      if (res.status === 200) {
        this.$router.push({ path: '/' })
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          this.$notification.success({
            message: '欢迎',
            description: res?.message || `${timeFix()}，欢迎回来`
          })
        }, 1000)
      } else if (res.status === 201) {
        // 用户首次登录，弹出窗口修改个人信息
        // this.$router.push({ path: '/xxxxxxxxxxpage' })
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          this.$notification.success({
            message: '账号首次登录，请修改信息后登陆',
            description: '请及时修改密码及个人信息'
          })
          setTimeout(() => {
            this.visible = true
          }, 2000)
        }, 1000)
      }
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
