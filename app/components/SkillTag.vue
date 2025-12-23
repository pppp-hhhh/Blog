<template>
  <span
      :class="[
      'inline-block px-3 py-1 text-sm rounded-full',
      bgColor,
      textColor
    ]"
  >
    {{ label }}
  </span>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'default'
  }
})


const bgColor = 'bg-gray-800'
const textColor = 'text-gray-300'
</script>
