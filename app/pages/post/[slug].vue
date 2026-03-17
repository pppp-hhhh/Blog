<script setup>
const route = useRoute()
const slug = route.params.slug

// 使用 lazy 模式，先显示页面再加载数据
const { data, error, pending, refresh } = await useFetch(`/api/posts/${slug}`, {
  key: `post-${slug}`,
  lazy: true,
  server: true,
  default: () => ({ meta: { title: '加载中...', date: null }, blocks: [] }),
  transform: (response) => {
    if (!response) return { meta: { title: '无标题', date: null }, blocks: [] }
    return response
  }
})

// 使用 computed 确保 SEO meta 响应式更新
const pageTitle = computed(() => data.value?.meta?.title || '笔记详情')

useSeoMeta({
  title: pageTitle,
  description: () => `查看笔记: ${pageTitle.value}`
})

// 缓存渲染结果
const renderedBlocks = computed(() => {
  if (!data.value?.blocks?.length) return []
  return data.value.blocks.map(renderBlock).filter(Boolean)
})

// 渲染 Notion 块内容为 HTML
function renderBlock(block) {
  if (!block) return null
  
  switch (block.type) {
    case 'paragraph':
      return {
        component: 'p',
        props: { class: 'text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg' },
        content: block.paragraph?.rich_text?.map(t => t.plain_text).join('') || ''
      }
    case 'heading_1':
      return {
        component: 'h1',
        props: { class: 'text-4xl font-bold text-gray-900 dark:text-white mb-8 mt-12 border-b border-gray-200 dark:border-gray-700 pb-4' },
        content: block.heading_1?.rich_text?.map(t => t.plain_text).join('') || ''
      }
    case 'heading_2':
      return {
        component: 'h2',
        props: { class: 'text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 mt-10 flex items-center gap-3' },
        content: '▸ ' + (block.heading_2?.rich_text?.map(t => t.plain_text).join('') || '')
      }
    case 'heading_3':
      return {
        component: 'h3',
        props: { class: 'text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 mt-8 text-primary-600 dark:text-primary-400' },
        content: block.heading_3?.rich_text?.map(t => t.plain_text).join('') || ''
      }
    case 'bulleted_list_item':
      return {
        component: 'li',
        props: { class: 'flex items-start gap-3 mb-3 text-gray-700 dark:text-gray-300' },
        content: '• ' + (block.bulleted_list_item?.rich_text?.map(t => t.plain_text).join('') || '')
      }
    case 'numbered_list_item':
      return {
        component: 'li',
        props: { class: 'flex items-start gap-3 mb-3 text-gray-700 dark:text-gray-300' },
        content: (block.numbered_list_item?.rich_text?.map(t => t.plain_text).join('') || '')
      }
    case 'code':
      return {
        component: 'div',
        props: { class: 'my-8' },
        isCode: true,
        code: block.code?.rich_text?.map(t => t.plain_text).join('') || '',
        language: block.code?.language || 'text'
      }
    case 'quote':
      return {
        component: 'blockquote',
        props: { class: 'border-l-4 border-primary-500 pl-6 py-4 my-8 bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/20 dark:to-transparent rounded-r-lg italic text-lg text-gray-700 dark:text-gray-300' },
        content: block.quote?.rich_text?.map(t => t.plain_text).join('') || ''
      }
    case 'divider':
      return {
        component: 'hr',
        props: { class: 'my-12 border-gray-200 dark:border-gray-700' },
        content: ''
      }
    case 'callout':
      return {
        component: 'div',
        props: { class: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 my-8 flex items-start gap-4 shadow-sm' },
        content: (block.callout?.icon?.emoji || '💡') + ' ' + (block.callout?.rich_text?.map(t => t.plain_text).join('') || '')
      }
    case 'toggle':
      return {
        component: 'details',
        props: { class: 'my-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 cursor-pointer' },
        content: block.toggle?.rich_text?.map(t => t.plain_text).join('') || '',
        isToggle: true
      }
    default:
      return null
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- 顶部导航栏 -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <UButton
          to="/notion"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          color="gray"
          class="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          返回笔记列表
        </UButton>
        <div class="flex items-center gap-3">
          <UBadge color="primary" variant="soft" class="flex items-center gap-2 px-3 py-1">
            <Icon name="i-simple-icons-notion" class="w-4 h-4" />
            <span>Notion</span>
          </UBadge>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-12 max-w-4xl">
      <!-- 加载状态 -->
      <div v-if="pending && !data?.meta?.title" class="space-y-8">
        <div class="h-16 w-3/4 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div class="h-6 w-1/3 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div class="space-y-6 mt-12">
          <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div class="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div class="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div class="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-12">
        <Icon name="i-heroicons-exclamation-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">加载失败</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">{{ error.message }}</p>
        <div class="flex gap-4 justify-center">
          <UButton @click="refresh" icon="i-heroicons-arrow-path">
            重试
          </UButton>
          <UButton to="/notion" variant="soft" icon="i-heroicons-arrow-left">
            返回列表
          </UButton>
        </div>
      </div>

      <!-- 文章内容 -->
      <article v-else class="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <!-- 文章头部 -->
        <div class="relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 px-8 py-16 overflow-hidden">
          <!-- 装饰背景 -->
          <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>
          
          <div class="relative text-center">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {{ data?.meta?.title }}
            </h1>
            <div class="flex items-center justify-center gap-6 text-primary-100">
              <span v-if="data?.meta?.date" class="flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2">
                <Icon name="i-heroicons-calendar" class="w-5 h-5" />
                {{ new Date(data.meta.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 文章内容 -->
        <div class="px-8 md:px-12 py-12">
          <div v-for="(rendered, index) in renderedBlocks" :key="index" class="content-block">
            <!-- 代码块特殊处理 -->
            <template v-if="rendered.isCode">
              <UCard class="overflow-hidden shadow-lg border-0">
                <template #header>
                  <div class="flex items-center justify-between px-4 py-3 bg-gray-800">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-red-500"></span>
                      <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
                      <span class="w-3 h-3 rounded-full bg-green-500"></span>
                      <span class="ml-3 text-sm text-gray-400 font-mono">{{ rendered.language }}</span>
                    </div>
                    <UButton
                      size="xs"
                      variant="ghost"
                      color="gray"
                      icon="i-heroicons-clipboard"
                      class="text-gray-400 hover:text-white"
                      @click="navigator.clipboard.writeText(rendered.code)"
                    >
                      复制
                    </UButton>
                  </div>
                </template>
                <pre class="p-6 overflow-x-auto text-sm bg-gray-900 text-gray-100 leading-relaxed"><code>{{ rendered.code }}</code></pre>
              </UCard>
            </template>

            <!-- Toggle 块 -->
            <template v-else-if="rendered.isToggle">
              <details class="my-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 cursor-pointer border border-gray-200 dark:border-gray-700">
                <summary class="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Icon name="i-heroicons-chevron-right" class="w-5 h-5 transition-transform" />
                  {{ rendered.content }}
                </summary>
              </details>
            </template>

            <!-- 普通块 -->
            <component
              v-else
              :is="rendered.component"
              v-bind="rendered.props"
            >
              {{ rendered.content }}
            </component>
          </div>
        </div>

        <!-- 文章底部 -->
        <div class="px-8 md:px-12 py-8 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800/30">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <UButton
              to="/notion"
              variant="ghost"
              icon="i-heroicons-arrow-left"
              color="gray"
              size="lg"
            >
              返回笔记列表
            </UButton>
            <div class="flex items-center gap-2 text-gray-500">
              <Icon name="i-simple-icons-notion" class="w-5 h-5" />
              <span>同步自 Notion</span>
            </div>
          </div>
        </div>
      </article>
    </main>
  </div>
</template>

<style scoped>
.content-block ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.content-block ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

details[open] summary svg {
  transform: rotate(90deg);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
