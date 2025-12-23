<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  to: string
}>()
</script>

<template>
  <UPageCard
    :title="props.title"
    :description="props.description"
    :to="props.to"
    variant="outline"
  />
</template>