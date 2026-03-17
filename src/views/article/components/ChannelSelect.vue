<script setup>
import { ref } from 'vue'
import { channelGetService } from '@/api/article'

const modelValue = defineModel({
  type: [String, Number]
})

const channelList = ref([])
const getChannelList = async () => {
  const res = await channelGetService()
  channelList.value = res.data.data
}
getChannelList()
</script>

<template>
  <el-select v-model="modelValue" placeholder="请选择" clearable>
    <el-option
      v-for="item in channelList"
      :key="item.id"
      :label="item.cate_name"
      :value="item.id"
    />
  </el-select>
</template>

<style scoped></style>
