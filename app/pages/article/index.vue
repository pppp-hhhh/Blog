<script lang="ts" setup>

const {data: posts} = await useAsyncData(async () => {
  const items = await queryCollection('content')
      .all()
  items.forEach((item) => {
    item.title = item.title || ''
  })
  return items
}, {default: () => []})

</script>

<template>
  <!--显示所有结果-->
  <div class="w-full md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col gap-6">
    <div v-for="article in posts" :key="article.id">
      <ArticleCard
          :title="article.title || article.path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Untitled'"
          :to="`${article.path}`"
      />
    </div>
  </div>
</template>

