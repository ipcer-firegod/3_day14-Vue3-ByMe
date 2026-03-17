<script setup>
import { ref } from 'vue'
import { userUpdatePwdService } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

// 表单数据
const form = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 表单验证规则
const rules = {
  old_pwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    // 校验新密码和原密码不能一样
    {
      validator: (rule, value, callback) => {
        if (value === form.value.old_pwd) {
          callback(new Error('新密码不能与旧密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.new_pwd) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 表单引用
const formRef = ref()
const userStore = useUserStore()
const router = useRouter()
// 提交表单
const onSubmit = async () => {
  try {
    await formRef.value.validate()
    await userUpdatePwdService(form.value)
    ElMessage.success('密码更新成功')
    // 密码修改成功后，退出重新登录
    // 清空本地存储的 token 和 个人信息
    userStore.setToken('')
    userStore.setUser({})

    // 拦截登录
    router.push('/login')
  } catch {
    ElMessage.error('密码更新失败')
  }
}

// 重置表单
const onReset = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <page-container>
    <template #title>重置密码</template>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="password-form"
    >
      <el-form-item label="旧密码" prop="old_pwd">
        <el-input v-model="form.old_pwd" type="password" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="form.new_pwd" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="re_pwd">
        <el-input v-model="form.re_pwd" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新密码</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style scoped lang="scss">
.password-form {
  max-width: 600px;
}
</style>
