<script setup>
import { ref, watch } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { userRegisterService, userLoginService } from '@/api/user'
import { ElMessage } from 'element-plus'
//<!--!注意这里不用这个 import router from '@/router'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const isRegister = ref(false)
const ruleFormRef = ref()

const ruleForm = ref({
  username: '',
  password: '',
  repassword: ''
})

const confirmPassword = (rule, value, callback) => {
  if (value !== ruleForm.value.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 10,
      message: '用户名长度必须在3到10个字符之间',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    {
      required: true,
      message: '请确认密码',
      trigger: 'blur'
    },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    },
    { validator: confirmPassword, trigger: 'blur' }
  ]
}

const register = async () => {
  // <!--!validate为什么要await呢？
  await ruleFormRef.value.validate()
  await userRegisterService(ruleForm.value)
  ElMessage.success('注册成功')
  isRegister.value = false
}

const login = async () => {
  await ruleFormRef.value.validate()
  const res = await userLoginService(ruleForm.value)
  userStore.setToken(res.data.token)
  ElMessage.success('登录成功')
  router.push('/')
}

watch(isRegister, () => {
  if (ruleForm.value) {
    ruleForm.value = {
      username: '',
      password: '',
      repassword: ''
    }
  }
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"> </el-col>
    <el-col :span="6" :offset="3" class="form-col">
      <!-- 注册表单 -->
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        size="large"
        status-icon
        style="max-width: 600px"
        v-if="isRegister"
      >
        <el-form-item>
          <h2>注册</h2>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="ruleForm.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请确认密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register" auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="info" underline="never" @click="isRegister = false">
            ← 登录
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录表单 -->
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        size="large"
        status-icon
        style="max-width: 600px"
        v-if="!isRegister"
      >
        <el-form-item>
          <h2>登录</h2>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item>
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" underline="never">忘记密码</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" auto-insert-space>
            登录
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="info" underline="never" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.login-page {
  height: 100vh;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form-col {
    border: 2px solid pink;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // align-items: center;
    .el-button {
      width: 100%;
    }
    .flex {
      display: flex;
      justify-content: space-between;
      //<!--! 这个很关键
      width: 100%;
    }
  }
}
</style>
