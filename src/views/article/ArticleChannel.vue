<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { channelGetService, channelDeleteService } from '@/api/article'
import ChannelEdit from '@/views/article/components/ChannelEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialog = ref()
const loading = ref(false)
const channelList = ref([])

const getChannelList = async () => {
  loading.value = true
  const res = await channelGetService()
  //<!--! 之前这里产生bug: channelList.value = res.data
  // 后端返回的数据结构为 { code, message, data }，其中res.data是整个对象， 对象的.data 才是列表。
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

const handleEdit = (row) => {
  dialog.value.open(row)
}

const handleAddChannel = () => {
  dialog.value.open()
}

const onSuccess = () => {
  getChannelList()
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('你确认要删除该分类么', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await channelDeleteService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
</script>

<template>
  <page-container>
    <template #title>文章分类</template>
    <template #extra>
      <el-button type="primary" @click="handleAddChannel">添加分类</el-button>
    </template>

    <el-table :data="channelList" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button
            type="primary"
            @click="handleEdit(row)"
            :icon="Edit"
            circle
            plain
          >
          </el-button>
          <el-button
            type="danger"
            @click="handleDelete(row)"
            :icon="Delete"
            circle
            plain
          >
          </el-button>
        </template>
      </el-table-column>

      <!-- ! 为什么要加上 #empty 才会生效？这是el-table的具名插槽（不是el-empty的） -->
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>

<style scoped></style>
