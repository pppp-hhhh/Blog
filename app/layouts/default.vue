<script lang="ts" setup>
const route = useRoute()
const author = '无趣'

const items = ref([
  {label: 'Home', to: '/', icon: 'mdi-light:home'},
  {label: 'article', to: '/article', icon: 'mdi-light:book'},
  {label: 'notion', to: '/notion', icon: 'mdi:pencil'},
  {label: 'about', to: '/about', icon: 'mdi-light:account'}
])

// 菜单栏的上滑偏移量
const headerOffset = ref(0)
let lastScrollY = 0
let lastTimestamp = 0

onMounted(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY
    const currentTimestamp = Date.now()
    
    // 计算滚动速度（像素/毫秒）
    const timeDiff = currentTimestamp - lastTimestamp
    const scrollDiff = Math.abs(currentScrollY - lastScrollY)
    const scrollSpeed = timeDiff > 0 ? scrollDiff / timeDiff : 0
    
    // 根据滚动速度调整上滑速度，使响应更加灵敏
    const speedFactor = Math.min(scrollSpeed * 15, 15) // 增加速度因子和最大限制
    
    if (currentScrollY > lastScrollY) {
      // 向下滚动，增加偏移量
      // 使用缓动效果，使动画更加自然
      headerOffset.value = Math.min(headerOffset.value + speedFactor * 0.8, 100)
    } else {
      // 向上滚动，减少偏移量
      // 向上滚动时恢复速度更快，使用更强的缓动
      headerOffset.value = Math.max(headerOffset.value - (speedFactor * 2.5), 0)
    }
    
    lastScrollY = currentScrollY
    lastTimestamp = currentTimestamp
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
  'fixed z-50 transition-all duration-200 ease-in-out w-full md:w-[75%]'
]"
        :style="{
      transform: `translateY(-${headerOffset}%)`,
      opacity: 1 - (headerOffset / 200),
      borderRadius: '1rem',
      boxShadow: headerOffset > 10 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
    }"

        title="无趣"
        to="/"
        :toggle="false"
    >
      <UNavigationMenu :items="items" class="hidden lg:flex"/>
      <template #right>
        <UColorModeSwitch/>
        <!-- 移动端/平板菜单按钮 -->
        <UPopover class="lg:hidden" :ui="{ content: 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-2 min-w-[160px]' }">
          <UButton
            icon="i-heroicons-bars-3"
            color="neutral"
            variant="ghost"
          />
          <template #content>
            <UNavigationMenu
              :items="items"
              orientation="vertical"
              class="gap-0.5"
              :ui="{
                link: 'py-2 px-3 rounded-lg hover:bg-gray-100/70 dark:hover:bg-gray-700/70 transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm whitespace-nowrap',
                linkLeadingIcon: 'w-4 h-4 text-gray-500 dark:text-gray-400',
                linkLabel: 'font-medium'
              }"
            />
          </template>
        </UPopover>
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
