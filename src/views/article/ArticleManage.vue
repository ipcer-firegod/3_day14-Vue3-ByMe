<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { articleGetListService, articleDeleteService } from '@/api/article'
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/format'
import ArticleEdit from '@/views/article/components/ArticleEdit.vue'

// 分类表单
const defaultForm = {
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
}

const formInline = ref({
  ...defaultForm
})

const onSearch = () => {
  formInline.value.pagenum = 1
  getArticleList()
}

const onReset = () => {
  formInline.value = {
    ...defaultForm
  }
  getArticleList()
}

// 文章编辑抽屉
// false
const drawer = ref(null)

const OnSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，需要跳转渲染最后一页，编辑直接渲染当前页
    const lastPage = Math.ceil((total.value + 1) / formInline.value.pagesize)
    formInline.value.pagenum = lastPage
  }
  getArticleList()
}

// 文章列表
const articleList = ref([])
const total = ref(0)
const loading = ref(false)

const getArticleList = async () => {
  loading.value = true
  const res = await articleGetListService(formInline.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()

// <!--! 加上drawer.value = true后，无法正常打开抽屉。为什么？
// 因为这是组件本身，想要让抽屉显现，需要使用组件中的 const drawerVisible = ref(false) 这部分内容控制 -->
const onEdit = (row) => {
  // drawer.value = true
  drawer.value.open(row)
}

const onAddArticle = () => {
  // drawer.value = true
  // <!--! 是否需要 {} ？
  drawer.value.open({})
}

const onDelete = async (row) => {
  await ElMessageBox.confirm('你确认要删除该文章么', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await articleDeleteService(row.id)
  ElMessage.success('删除成功')
  getArticleList()
}

// 分页
const onSizeChange = (val) => {
  formInline.value.pagenum = 1
  formInline.value.pagesize = val
  getArticleList()
}
const onCurrentChange = (val) => {
  formInline.value.pagenum = val
  getArticleList()
}
</script>

<template>
  <page-container>
    <template #title>文章管理</template>
    <template #extra>
      <el-button type="primary" @click="onAddArticle">发布文章</el-button>
    </template>

    <!-- 分类表单 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="文章分类">
        <channel-select v-model="formInline.cate_id" />
      </el-form-item>
      <el-form-item label="发布状态">
        <el-select v-model="formInline.state" placeholder="请选择" clearable>
          <el-option label="已发布" value="已发布" />
          <el-option label="草稿" value="草稿" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 文章列表 -->
    <el-table
      :data="articleList"
      style="width: 100%; height: 400px"
      v-loading="loading"
    >
      <el-table-column prop="title" label="文章标题">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类" />
      <el-table-column prop="pub_date" label="发表时间">
        <template #default="{ row }">
          {{ formatDate(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            type="primary"
            @click="onEdit(row)"
            :icon="Edit"
            circle
            plain
          >
          </el-button>
          <el-button
            type="danger"
            @click="onDelete(row)"
            :icon="Delete"
            circle
            plain
          >
          </el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <!-- 分页组件 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="formInline.pagenum"
        v-model:page-size="formInline.pagesize"
        :page-sizes="[2, 3, 5, 10]"
        :size="size"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </div>

    <!-- 文章编辑抽屉 -->
    <article-edit ref="drawer" @success="OnSuccess"></article-edit>
  </page-container>
</template>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
