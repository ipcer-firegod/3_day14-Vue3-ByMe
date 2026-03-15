<script setup></script>

<template>
  <!-- ! 之前因为  style="max-width: 480px"  出现下面的问题 -->
  <el-card class="page-container">
    <template #header>
      <div class="card-header">
        <span>
          <slot name="title">默认标题</slot>
        </span>
        <slot name="extra">默认按钮</slot>
      </div>
    </template>
    <slot>默认内容</slot>
  </el-card>
</template>

<style scoped lang="scss">
.page-container {
  //<!--! my项目中没有加width也可以撑满，这里不行？可能是因为内容撑满的
  min-height: 100%;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
