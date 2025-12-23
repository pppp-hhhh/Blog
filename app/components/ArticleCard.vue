<!--文章-->
<template>
  <nuxt-link v-if="article.to" :to="article.to">
    <UCard variant="outline">
      <template #header>
        <h2 class="text-xl font-bold">{{ article.title }}</h2>
      </template>
    </UCard>
  </nuxt-link>
</template>
<script setup lang="ts">
const article = defineProps<{
  title: string
  to?: string
}>()
</script>