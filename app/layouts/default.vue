<template>
  <div class="min-h-screen bg-gray-900 flex flex-col">
    <!--    导航栏-->
    <div
        class="bg-gray-900 text-white flex justify-end items-center text-xl py-4 px-6 border border-gray-700 sticky top-0 z-50"
        style="font-family: 'Microsoft YaHei', sans-serif;">
      <div class="flex space-x-4">
        <nuxt-link v-for="link in links" :key="link.name" :to="link.path"
                   class="hover:text-gray-300 transition-colors duration-200">
          {{ link.name }}
        </nuxt-link>
        <nuxt-link rel="noopener noreferrer" target="_blank" to="https://github.com/pppp-hhhh">
          <Icon class="w-16 h-16 hover:text-gray-300 transition-colors duration-200 !important"
                name="mdi:github"></Icon>
        </nuxt-link>
      </div>
    </div>
    <!--主要内容-->
    <main class="flex-1 w-4/5 mx-auto py-8">
      <!-- 页面内容将在这里渲染 -->
      <NuxtPage />
    </main>
    <!--  页脚-->
    <footer class="bg-gray-900 text-white py-6 px-4 border-t border-gray-700">
      <div class="w-4/5 mx-auto flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <p class="text-gray-400">© {{ new Date().getFullYear() }} {{ author }}. All rights reserved.</p>
        </div>
        <div class="flex space-x-4">
        </div>
      </div>
    </footer>

  </div>
</template>

<script lang="ts" setup>
const author = '无趣'
const links = [
  {
    name: '首页',
    path: '/'
  },
  {
    name: '文章',
    path: '/article'
  },
  {
    name: '关于我',
    path: '/about'
  }
]
</script>