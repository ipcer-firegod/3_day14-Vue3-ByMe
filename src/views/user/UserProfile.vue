<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

// 表单数据
const form = ref({
  id: userStore.user.id || '',
  username: userStore.user.username || '',
  nickname: userStore.user.nickname || '',
  email: userStore.user.email || ''
})

// 表单验证规则
const rules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 表单引用
const formRef = ref()

// 提交表单
const onSubmit = async () => {
  try {
    await formRef.value.validate()
    await userUpdateInfoService(form.value)
    ElMessage.success('更新成功')
    // 更新store中的用户信息
    // userStore.setUser({ ...userStore.user, ...form.value })
    userStore.getUser()
  } catch {
    ElMessage.error('更新失败')
  }
}

// 重置表单
const onReset = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <page-container>
    <template #title>基本资料</template>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="profile-form"
    >
      <el-form-item label="用户ID" prop="id">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style scoped lang="scss">
.profile-form {
  max-width: 600px;
}
</style>
