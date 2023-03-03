<template>
  <div class="forgetContent">
    <div class="title"><h1>密码找回</h1></div>
    <div class="steps-content" v-if="current">
      <div class="input">
        <a-form-model ref="ruleForm" :model="form" :rules="rules">
          <!-- 手机号 -->
          <a-form-model-item ref="telephone" prop="telephone" @submit="next">
            <a-input size="large" v-model="form.telephone" placeholder="请输入手机号"> <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/></a-input>
          </a-form-model-item>
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <!-- 输入验证码 -->
              <a-form-model-item ref="code" prop="code">
                <a-input size="large" v-model="form.code" placeholder="请输入验证码">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-model-item>
            </a-col>
            <!-- 验证码按钮 -->
            <a-col class="gutter-row" :span="8">
              <a-button
                :disabled="state.smsSendBtn"
                @click="getUserCode(form.telephone)"
                class="getCaptcha"
                v-text="!state.smsSendBtn && ( state.name ) || (state.time+' s')"
              ></a-button>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="24">
              <a-form-model-item ref="newPassword" prop="newPassword" @submit="next">
                <a-input-password
                  v-model="form.newPassword"
                  size="large"
                  placeholder="设置您新的密码"
                >
                  <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input-password>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="24">
              <a-form-model-item ref="oldPassword" prop="oldPassword" @submit="next">
                <a-input
                  type="password"
                  v-model="form.oldPassword"
                  size="large"
                  placeholder="再次输入新密码，确保两次密码一致"
                >
                  <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item style="text-align: center;">
            <a-button type="primary" @click="fixPassword"> 确认修改 </a-button>
            <a-button style="margin-left: 10px;" @click="resetForm">
              重置表单
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <div class="steps-content" v-if="!current">
      <div class="input">
        <!-- 提示语 -->
        <a-divider style=" margin-bottom: 15%">密码重置成功，请重新登录！</a-divider>
        <!-- 跳转登录页按钮 -->
        <a-button size="large" type="primary" @click="toLogin">重新登录</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getCode, forgetPassword } from '@/api/forgetPassword'
export default {
  data () {
    return {
      current: true,
      customActiveKey: 'mobile',
      steps: [
        {
          title: '身份认证',
          key: '1'
        },
        {
          title: '密码重置',
          key: '2'
        },
        {
          title: '重置成功',
           key: '3'
        }
      ],
      /**
       * 验证码转化
       */
      state: {
        smsSendBtn: false,
        time: 60,
        name: '获取验证码',
        timer: null,
        ruleShow: true
      },
      /**
       * 表单数据
      */
      form: {
        telephone: '', // 电话
        code: '', // 验证码
        newPassword: '', // 第一次密码
        oldPassword: '', // 第二次确认密码
        token: ''
      },
      rules: {
        telephone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { len: 11, message: '请输入正确的电话号码' },
          { pattern: /^[1][34578][0-9]{9}$/, message: '请输入正确的电话号码' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        newPassword: [
           { min: 8, message: '密码长度至少8位', trigger: 'blur' },
           { max: 16, message: '密码长度最高16位', trigger: 'blur' },
           { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, message: '密码需包含大写字母,小写字母和数字' }
        ],
        oldPassword: [
           { required: true, message: '请再次输入密码', trigger: 'blur' },
           { min: 8, message: '密码长度至少8位', trigger: 'blur' },
           { max: 16, message: '密码长度最高16位', trigger: 'blur' },
           { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, message: '密码需包含大写字母,小写字母和数字' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    next (e) {
      console.log(this.form)
       e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
         this.current++
        } else {
          return false
        }
      })
    },
    prev () {
      this.current--
       console.log(this.current)
    },
        // 获取验证码
    getUserCode (p) {
      console.log(p)
     var Reg = /^[1][34578][0-9]{9}$/
      if (this.form.telephone === '') {
        this.$message.error('请输入手机号码')
      } else if (Reg.test(this.form.telephone)) {
               getCode(p).then(res => {
                if (res.status === 200) {
                  this.$message.success(res.message || '验证码发送成功')
                  this.form.token = res.data.token
                  this.state.smsSendBtn = true
                  const interval = window.setInterval(() => {
                  if (this.state.time-- <= 0) {
                        this.state.time = 60
                      this.state.smsSendBtn = false
                      window.clearInterval(interval)
                    }
                }, 1000)
                } else if (res.status === 400) {
                  this.$message.error(res.message || '发送验证码失败')
                }
            })
            } else {
              this.$message.warning('手机号码格式不正确')
            }
    },
    fixPassword (e) {
      e.preventDefault()
       this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.form.newPassword === this.form.oldPassword) {
             forgetPassword(this.form).then(res => {
              if (res.status === 200) {
                 this.$message.success(res.$message || '修改密码成功')
                 this.current = false
              } else if (res.status === 400) {
                this.$message.error(res.message || '修改密码不成功,请重新尝试')
              }
             })
            } else {
              this.$message.error('两次输入的密码不同,请修改')
          }
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    toLogin () {
      this.$router.push({ path: '/user/login' })
    }
  }
}
</script>
<style scoped>
.title{
  text-align: center;
  margin-bottom: 4%;
  /* font-size: 2em; */
}
.forgetContent {
  margin: 5% 20%;
}
.input{
  margin: 0 auto;
  margin-bottom: 8%;
  width: 60%;
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  /* text-align: center; */
  padding-top: 80px;
}
.steps-action {
  margin-top: 24px;
}
.getCaptcha {
  display: block;
  width: 100%;
  height: 40px;
}
</style>
