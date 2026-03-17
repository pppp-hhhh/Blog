<script setup>
// 使用 useFetch 的 key 和 lazy 选项优化加载
const { data: posts, error, pending, refresh } = await useFetch('/api/posts', {
  key: 'notion-posts',
  lazy: false,
  server: true,
  default: () => [],
  transform: (data) => data || []
})

useSeoMeta({
  title: 'Notion 笔记',
  description: '查看和管理我的 Notion 笔记'
})

// 当前选中的数据库
const selectedDatabase = ref('all')

// 获取所有数据库列表
const databases = computed(() => {
  if (!posts.value?.length) return []
  const dbMap = new Map()
  posts.value.forEach(post => {
    if (post.databaseId && post.databaseName) {
      dbMap.set(post.databaseId, post.databaseName)
    }
  })
  return Array.from(dbMap.entries()).map(([id, name]) => ({ id, name }))
})

// 筛选后的笔记
const filteredPosts = computed(() => {
  if (!posts.value?.length) return []
  if (selectedDatabase.value === 'all') return posts.value
  return posts.value.filter(post => post.databaseId === selectedDatabase.value)
})

// 渲染块内容 - 使用 Map 缓存结果
const blockCache = new Map()

function renderBlock(block) {
  if (!block) return null
  
  // 使用 block id 作为缓存 key
  const cacheKey = block.id || JSON.stringify(block)
  if (blockCache.has(cacheKey)) {
    return blockCache.get(cacheKey)
  }
  
  let result = null
  
  switch (block.type) {
    case 'paragraph':
      result = {
        type: 'text',
        content: block.paragraph?.rich_text?.map(t => t.plain_text).join('') || ''
      }
      break
    case 'bulleted_list_item':
      result = {
        type: 'bullet',
        content: block.bulleted_list_item?.rich_text?.map(t => t.plain_text).join('') || ''
      }
      break
    case 'numbered_list_item':
      result = {
        type: 'number',
        content: block.numbered_list_item?.rich_text?.map(t => t.plain_text).join('') || ''
      }
      break
    case 'heading_2':
      result = {
        type: 'heading',
        content: block.heading_2?.rich_text?.map(t => t.plain_text).join('') || ''
      }
      break
    case 'heading_3':
      result = {
        type: 'subheading',
        content: block.heading_3?.rich_text?.map(t => t.plain_text).join('') || ''
      }
      break
    case 'callout':
      result = {
        type: 'callout',
        icon: block.callout?.icon?.emoji || '💡',
        content: block.callout?.rich_text?.map(t => t.plain_text).join('') || ''
      }
      break
    case 'child_page':
      result = {
        type: 'page',
        title: block.child_page?.title || 'Untitled'
      }
      break
    default:
      result = null
  }
  
  if (result && cacheKey) {
    blockCache.set(cacheKey, result)
  }
  
  return result
}

// 获取笔记的所有预览块
function getPreviewBlocks(post) {
  if (!post.previewBlocks?.length) {
    return []
  }
  return post.previewBlocks.map(renderBlock).filter(b => b && b.content)
}

// 预加载详情页数据 - 使用 Set 避免重复
const prefetchedPosts = new Set()

function prefetchPost(postId) {
  if (prefetchedPosts.has(postId) || typeof document === 'undefined') return
  
  prefetchedPosts.add(postId)
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = `/api/posts/${postId}`
  link.as = 'fetch'
  link.onload = () => {
    // 加载完成后从 DOM 移除
    link.remove()
  }
  document.head.appendChild(link)
}
</script>

<template>
  <div class="min-h-screen">
    <!-- 主内容区域 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Icon name="i-simple-icons-notion" class="w-6 h-6" />
          笔记
        </h1>
      </div>

      <!-- 数据库筛选标签 -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          :class="[
            'px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap font-medium',
            selectedDatabase === 'all' 
              ? 'bg-primary-600 text-white shadow-md' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
          @click="selectedDatabase = 'all'"
        >
          全部
        </button>
        <button
          v-for="db in databases"
          :key="db.id"
          :class="[
            'px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap font-medium',
            selectedDatabase === db.id 
              ? 'bg-primary-600 text-white shadow-md' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
          @click="selectedDatabase = db.id"
        >
          {{ db.name }}
        </button>
        <UButton
          icon="i-heroicons-arrow-path"
          color="gray"
          variant="ghost"
          size="sm"
          class="ml-auto"
          :loading="pending"
          @click="refresh"
        />
      </div>

      <!-- 加载状态 - 骨架屏 -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white dark:bg-gray-800 rounded-xl p-5 h-64 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-12">
        <Icon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400 mb-4">加载失败: {{ error.message }}</p>
        <UButton @click="refresh" icon="i-heroicons-arrow-path">重试</UButton>
      </div>

      <!-- 空状态 -->
      <div v-else-if="filteredPosts.length === 0" class="text-center py-12">
        <Icon name="i-heroicons-inbox" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400">暂无笔记</p>
      </div>

      <!-- 笔记卡片网格 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="post in filteredPosts"
          :key="post.id"
          :to="`/post/${post.id}`"
          class="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 flex flex-col"
          @mouseenter="prefetchPost(post.id)"
        >
          <!-- 内容区域 -->
          <div class="flex-1 p-5 space-y-2.5">
            <template v-if="getPreviewBlocks(post).length > 0">
              <template v-for="(block, index) in getPreviewBlocks(post)" :key="index">
                <!-- 文本段落 -->
                <p v-if="block.type === 'text'" class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {{ block.content }}
                </p>
                
                <!-- 列表项 -->
                <div v-else-if="block.type === 'bullet'" class="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <span class="text-primary-500 mt-1">•</span>
                  <span class="line-clamp-1">{{ block.content }}</span>
                </div>
                
                <!-- 数字列表 -->
                <div v-else-if="block.type === 'number'" class="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <span class="text-primary-500 mt-1 font-medium">{{ index + 1 }}.</span>
                  <span class="line-clamp-1">{{ block.content }}</span>
                </div>
                
                <!-- 标题 -->
                <h3 v-else-if="block.type === 'heading'" class="text-gray-900 dark:text-gray-100 font-semibold text-sm flex items-center gap-2">
                  <span v-if="block.content.includes('🚀')" class="text-base">🚀</span>
                  <span v-else class="text-primary-500">▸</span>
                  {{ block.content.replace(/[🚀📝✅]/g, '').trim() }}
                </h3>
                
                <!-- 子标题 -->
                <h4 v-else-if="block.type === 'subheading'" class="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {{ block.content }}
                </h4>
                
                <!-- Callout -->
                <div v-else-if="block.type === 'callout'" class="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm bg-primary-50 dark:bg-primary-900/20 rounded-lg px-3 py-2">
                  <span>{{ block.icon }}</span>
                  <span class="line-clamp-1">{{ block.content }}</span>
                </div>
                
                <!-- 子页面 -->
                <div v-else-if="block.type === 'page'" class="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-sm">
                  <Icon name="i-heroicons-document" class="w-4 h-4" />
                  <span class="line-clamp-1">{{ block.title }}</span>
                </div>
              </template>
            </template>
            <p v-else class="text-gray-400 dark:text-gray-500 text-sm italic">
              暂无预览内容
            </p>
          </div>

          <!-- 底部信息栏 -->
          <div class="px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon name="i-heroicons-document-text" class="w-4 h-4 text-gray-400" />
              <span class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{{ post.title }}</span>
            </div>
            <Icon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
          </div>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
