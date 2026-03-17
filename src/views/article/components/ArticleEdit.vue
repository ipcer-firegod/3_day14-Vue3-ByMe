<script lang setup>
import { ref } from 'vue'
import {
  articleUpdateService,
  articlePublishService,
  articleGetInfoService
} from '@/api/article'
import { ElMessage } from 'element-plus'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const drawerVisible = ref(false)
const imageUrl = ref('')
const editorRef = ref()
// <!--!不用加ref
const defaultForm = {
  // id: '',
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
}

const formModel = ref({ ...defaultForm })

// <!--! 子传父
const emit = defineEmits(['success'])

const onPublish = async (state) => {
  // 将已发布还是草稿状态，存入 state
  formModel.value.state = state

  // 转换 formData 数据
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  // <!--! 参数使用 fd 而不是 formModel.value
  const isEdit = formModel.value.id
  if (isEdit) {
    await articleUpdateService(fd)
    ElMessage.success('文章编辑成功')
    drawerVisible.value = false
    emit('success', 'edit')
  } else {
    await articlePublishService(fd)
    ElMessage.success('文章添加成功')
    drawerVisible.value = false
    emit('success', 'add')
  }
  // drawerVisible.value = false
  // emit('success')
}

const open = async (row) => {
  drawerVisible.value = true
  if (row.id) {
    console.log('编辑回显')
    const res = await articleGetInfoService(row.id)
    formModel.value = res.data.data
    imageUrl.value = baseURL + formModel.value.cover_img
    // 提交给后台，需要的是 file 格式的，将网络图片，转成 file 格式
    // 网络图片转成 file 对象, 需要转换一下 imageUrlToFile
    const file = await imageUrlToFileObject(
      imageUrl.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
  } else {
    formModel.value = { ...defaultForm }
    imageUrl.value = ''
    editorRef.value.setHTML('')
  }
}

// 将网络图片地址转换为 File 对象的函数(ai 完成)
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })

    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })

    return file
  } catch (error) {
    console.error('Error converting image URL to File object:', error)
    return null
  }
}

// 图片上传
// <!--! 不理解 ； 是 uploadFile.raw 而非 imageUrl.value
const onUploadFile = (uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer v-model="drawerVisible" direction="rtl" size="50%">
    <template #header>
      <h4>{{ formModel.id ? '编辑文章' : '添加文章' }}</h4>
    </template>
    <template #default>
      <el-form
        ref="formModelRef"
        :model="formModel"
        style="max-width: 600px"
        label-width="100px"
      >
        <el-form-item prop="title" label="文章标题">
          <el-input v-model="formModel.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item prop="cate_id" label="文章分类">
          <channel-select v-model="formModel.cate_id" />
        </el-form-item>
        <el-form-item prop="cover_img" label="文章封面">
          <!-- ! 关闭自动上传(否则会点击后就直接上传了) -->
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :on-change="onUploadFile"
            auto-upload="false"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item prop="content" label="文章内容">
          <div class="editor">
            <quill-editor
              ref="editorRef"
              theme="snow"
              v-model:content="formModel.content"
              contentType="html"
            >
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish('已发布')">
            发布
          </el-button>
          <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
        </el-form-item>
      </el-form>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    // <!--! 不能去掉，否则上传图片后显示原图大小
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
      object-fit: cover;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
