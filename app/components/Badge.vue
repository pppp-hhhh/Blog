<script lang="ts" setup>
const {icon, label, to} = defineProps<{
  icon?: string
  label: string
  to?: string
  img?: string
}>()
</script>

<template>
  <NuxtLink
      :to="to"
      class="flex items-center gap-1 rounded-md border border-gray-700 hover:bg-gray-700 transition-all cursor-pointer py-1 px-2 w-fit"
  >
    <Icon
        v-if="icon"
        :name="icon"
        class="text-xl"
    />
    <img
        v-if="img"
        :src="img"
        alt="icon"
        class="w-5 h-5"
    />
    <span class="text-sm">{{ label }}</span>
  </NuxtLink>
</template>
