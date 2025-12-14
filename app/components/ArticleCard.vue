<!--文章-->
<template>
  <nuxt-link to="/app/components/articlecard">
    <div class="bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
      <h2 class="text-gray-400 text-2xl font-bold mb-2">{{ article.title }}</h2>
      <p class="text-gray-600 line-clamp-2">{{ article.content }}</p>
    </div>
  </nuxt-link>
</template>
<script setup lang="ts">
const article = defineProps<{
  title: string
  content: string
}>()
</script>