<script lang="ts" setup>
const route = useRoute()
const author = '无趣'

const items = ref([
  {label: 'Home', to: '/', icon: 'mdi-light:home'},
  {label: 'article', to: '/article', icon: 'mdi-light:book'},
  {label: 'about', to: '/about', icon: 'mdi-light:account'}
])

// 0 = 显示, 1 = 中间收起, 2 = 完全收起
const headerState = ref(0)
let lastScrollY = 0

onMounted(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight - 10
    if (currentScrollY > lastScrollY) {
      // 向下滚动
      if (currentScrollY > 50 && currentScrollY <= 150) {
        headerState.value = 1
      } else if (currentScrollY >= maxScrollY) {
        headerState.value = 2 // 到底部才收起
      }
    } else {
      if (currentScrollY <= 0) {
        headerState.value = 0
      } else if (currentScrollY <= 150) {
        headerState.value = 1  // 向上滚动时，只要位置 <= 150 就设为状态1
      } else {
        // 如果在中间位置向上滚动，确保状态不会停留在2
        if (headerState.value === 2 && currentScrollY < maxScrollY) {
          headerState.value = 1
        }
      }
    }
    lastScrollY = currentScrollY
  }

  window.addEventListener('scroll', handleScroll)
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<template>
  <div class="flex justify-center">
    <UHeader
        :class="[
  'fixed z-50 transition-all duration-300 ease-out',
  headerState === 0 ? 'top-0 rounded-none shadow-none'
  : headerState === 1 ? 'top-1 rounded-xl shadow-lg'
  : '-top-[120%] opacity-0 pointer-events-none rounded-xl shadow-lg'
]"
        :style="{
      width: headerState === 0 ? '75%' : '50%',
      opacity: headerState === 2 ? 0 : 1
    }"

        title="无趣"
        to="/"
    >
      <UNavigationMenu :items="items"/>
      <template #right>
        <UColorModeSwitch/>
      </template>
    </UHeader>
  </div>

  <UMain class="pt-24 w-3/4 mx-auto">
    <NuxtPage/>
  </UMain>
  <UFooter>
    <template #left>
      <div class="mb-4 md:mb-0">
        <p>© {{ new Date().getFullYear() }} {{ author }}. All rights reserved.</p>
      </div>
      <div class="flex space-x-4">
      </div>
    </template>
    <template #right>
      <UButton
          aria-label="GitHub"
          color="neutral"
          icon="i-simple-icons-github"
          size="xl"
          target="_blank"
          to="https://github.com/pppp-hhhh"
          variant="ghost"
      />
    </template>
  </UFooter>
</template>
