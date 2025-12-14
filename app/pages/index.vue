<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold text-gray-300 ">欢迎来到我的博客</h1>

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
      <h2 class="text-2xl font-bold text-gray-300 mt-10">个人介绍</h2>
      <div class="mt-8 text-gray-300 space-y-4 bg-gray-800 p-6 rounded-xl shadow-lg">
        <p class="leading-relaxed">我现在是一名广东第二师范学院大二软件工程专业的学生，精通 HTML/CSS/JavaScript 与 Vue
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
      <div class=" flex justify-center">
        <UInput icon="i-lucide-search" color="neutral" placeholder="请输入关键字" v-model="value" size="xl" variant="soft" class="w=full"/>
      </div>
      <h2 class="text-2xl font-bold text-gray-300">最新文章</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 ">
        <ArticleCard
            v-for="n in 4"
            :content="'文章内容'"
            :title="'文章标题'"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import head from "~/assets/头像.jpg"
const value = ref('')

</script>