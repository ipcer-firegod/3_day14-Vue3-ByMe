<script lang setup>
import { ref } from 'vue'
// import { ElMessageBox } from 'element-plus'
import { channelUpdateService, channelAddService } from '@/api/article'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)

const ruleFormRef = ref()

const ruleForm = ref({
  cate_name: '',
  cate_alias: ''
  // id: '' 如果为ts，需要添加这一行
})

const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是 1-10 位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类名必须是 1-15 位的字母或数字',
      trigger: 'blur'
    }
  ]
}

// <!--! 子传父
const emit = defineEmits(['success'])

const handleSubmit = async () => {
  //<!--! 注意，下面两行分别是ruleFormRef、ruleForm（此前因为这个出现bug）
  await ruleFormRef.value.validate()
  const isEdit = ruleForm.value.id
  if (isEdit) {
    await channelUpdateService(ruleForm.value)
    ElMessage.success('分类编辑成功')
  } else {
    await channelAddService(ruleForm.value)
    ElMessage.success('分类添加成功')
  }
  dialogVisible.value = false
  emit('success')
}

const open = (row) => {
  dialogVisible.value = true
  ruleForm.value = { ...row } // 添加 → 重置了表单内容，编辑 → 存储了需要回显的数据
}

// <!--! 向外暴露方法
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="ruleForm.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      size="large"
      style="max-width: 600px"
      hide-required-asterisk="false"
    >
      <el-form-item prop="cate_name" label="分类名称">
        <el-input v-model="ruleForm.cate_name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item prop="cate_alias" label="分类别名">
        <el-input v-model="ruleForm.cate_alias" placeholder="请输入分类别名" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
