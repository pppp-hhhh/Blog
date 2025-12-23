<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold  ">欢迎来到我的博客</h1>

  </div>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!--  个人介绍-->
    <div class="mt-8">
      <!--      头像-->
      <img
          :src="head"
          alt="头像"
          class="w-32 h-32 mx-auto rounded-full shadow-lg "
      />
      <h2 class="text-2xl font-bold  mt-10 text-center">个人介绍</h2>
      <div class="mt-8  space-y-4  p-6 rounded-xl  border-b-3 border-r-2 shadow-l- shadow-xl">
        <p class="leading-relaxed">我现在是一名广东第二师范学院大二软件工程专业的学生，学习过HTML/CSS/JavaScript与Vue
          3，同时熟悉 Windows、WSL、Linux 环境下的自动化脚本与故障排查。除了前端，我也学习过 Python、Java、C/C++，并尝试过
          FastAPI 与 Spring Boot 等后端框架，具备跨栈探索与实践能力。</p>
        <p class="leading-relaxed">学习上，我习惯用 Copilot 搜索并总结知识点生成页面，再收集到 Notion
          中进行整理，持续构建属于自己的知识库。</p>
        <p class="leading-relaxed">
          生活里，我喜欢打羽毛球、玩游戏，也热衷于研究黑苹果（Hackintosh），在技术之外保持探索精神与创造力。无论是团队协作还是个人项目，我都以解决导向和分享精神为核心，持续探索更优雅的实现方式。</p>
      </div>
    </div>

    <!--  最新文章-->
    <div class="mt-8">
      <h2 class="text-2xl font-bold mt-20">最新文章</h2>
      <div v-for="article in posts" :key="article.id" class="flex flex-col gap-6 mt-4">
        <ArticleCard
            :title="article.title || article.path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Untitled'"
            :to="`${article.path}`"
        />
      </div>
      </div>
    </div>
</template>
<script lang="ts" setup>
import head from "~~/public/头像.jpg"

const input = ref('')

const { data: posts } = await useAsyncData(async () => {
  const items = await queryCollection('content')
      .all()
  items.forEach((item) => {
    item.title = item.title || ''
  })
  return items
}, { default: () => [] })

</script>