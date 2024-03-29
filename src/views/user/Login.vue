<template>
  <a-form
    id="formLogin"
    class="user-layout-login"
    ref="formLogin"
    :form="form"
    @submit="handleSubmit"
  >
    <a-tabs
      :activeKey="customActiveKey"
      size="large"
      :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
      @change="handleTabClick"
    >
      <a-tab-pane key="tab1">
        <span slot="tab">
          <a-icon type="safety" />
          <b>CloudStack Login</b>
        </span>
        <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder="Username"
            v-decorator="[
              'username',
              {rules: [{ required: true, message: 'Enter your username' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
            ]"
          >
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-input
            size="large"
            type="password"
            autocomplete="false"
            placeholder="Password"
            v-decorator="[
              'password',
              {rules: [{ required: true, message: 'Enter your password' }], validateTrigger: 'blur'}
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder="Domain"
            v-decorator="[
              'domain',
              {rules: [{ required: false, message: 'Enter your domain, leave empty for ROOT domain' }], validateTrigger: 'change'}
            ]"
          >
            <a-icon slot="prefix" type="block" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>

      </a-tab-pane>
      <a-tab-pane key="tab2" disabled>
        <span slot="tab">
          <a-icon type="audit" />
          <b>SAML</b>
        </span>
      </a-tab-pane>
    </a-tabs>

    <a-form-item>
      <a-button
        size="large"
        type="primary"
        htmlType="submit"
        class="login-button"
        :loading="state.loginBtn"
        :disabled="state.loginBtn"
      >Log In</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  components: {
  },
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      loginType: 0,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        loginType: 0
      }
    }
  },
  created () {
  },
  methods: {
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

      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password', 'domain'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          delete loginParams.username
          loginParams[!state.loginType ? 'email' : 'username'] = values.username
          loginParams.password = values.password
          loginParams.domain = values.domain
          if (!loginParams.domain) {
            loginParams.domain = '/'
          }
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
    loginSuccess (res) {
      this.$router.push({ name: 'dashboard' })
      this.$message.success('Login Successful')
    },
    requestFailed (err) {
      if (err && err.response && err.response.data && err.response.data.loginresponse) {
        this.$message.error('Error ' + err.response.data.loginresponse.errorcode + ': ' + err.response.data.loginresponse.errortext)
      } else {
        this.$message.error('Login Failed')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  min-width: 260px;
  width: 368px;
  margin: 0 auto;

  .mobile & {
    max-width: 368px;
    width: 98%;
  }

  label {
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
