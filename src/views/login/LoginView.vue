<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <img src="@/assets/logo.svg" alt="logo" class="logo">
        <h2>云垦茶业ERP系统</h2>
      </div>
      
      <el-form 
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
          <el-link type="primary" class="forget-link">忘记密码？</el-link>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          // 模拟登录验证
          setTimeout(() => {
            if (this.loginForm.username === 'admin' && this.loginForm.password === 'admin123') {
              localStorage.setItem('token', 'mock-token')
              localStorage.setItem('userInfo', JSON.stringify({
                username: 'admin',
                name: '管理员',
                avatar: '',
                roles: ['admin']
              }))
              this.$router.push('/')
              this.$message.success('登录成功')
            } else {
              this.$message.error('用户名或密码错误')
            }
            this.loading = false
          }, 1000)
        }
      })
    }
  },
  mounted() {
    // 如果已登录，直接跳转到首页
    if (localStorage.getItem('token')) {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
}

.login-content {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: var(--box-shadow);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.login-header h2 {
  margin: 0;
  color: var(--heading-color);
  font-size: 24px;
  font-weight: 600;
}

.login-form {
  .el-form-item {
    margin-bottom: 24px;
  }

  .forget-link {
    float: right;
  }

  .login-button {
    width: 100%;
    height: 40px;
  }
}
</style> 