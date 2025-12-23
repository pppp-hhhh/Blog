<template>

  <div class="flex flex-col md:flex-row items-center justify-center gap-8 min-h-[80vh] w-full">
    <!-- 个人介绍 -->
    <div>
      <div class="flex gap-8 justify-center items-center">
        <img :src="head" alt="头像" class="size-32 rounded-xl"/>
        <div class="flex flex-col justify-center gap-3">
          <h1 class="text-4xl font-bold">
            无趣
          </h1>
          <div class="flex items-center gap-2">
            <Icon name="line-md:account"/>
            <span> 2006 / 07 / 28 </span>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="i-tabler-map-pin"/>
            <span> China / GuangDong </span>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="i-tabler-tools"/>
            <span> Full Stack</span>
          </div>
        </div>
      </div>
      <div class="flex justify-center ">
        <div class="flex flex-col items-start mt-8 mx-auto gap-y-2">
          <div class="flex items-center gap-4">
            <p class="font-bold w-60 text-left text-xl">
              Languages
            </p>
            <Badge
                icon="material-icon-theme:python"
                label="Python"

            />
            <Badge
                icon="material-icon-theme:java"
                label="Java"

            />
          </div>
          <div class="flex items-center gap-4">
            <p class="font-bold w-60 text-left text-xl">Tech Stack</p>
            <Badge
                icon="material-icon-theme:vue"
                label="Vue"
            />
            <Badge
                icon="material-icon-theme:nuxt"
                label="Nuxt"
            />
            <Badge
                img="spring-boot-seeklogo.svg"
                label="SpringBoot"
            />
          </div>
          <div class="flex items-center gap-4">
            <p class="font-bold w-60 text-left text-xl">
              Dev Tools
            </p>
            <Badge
                icon="material-icon-theme:vscode"
                label="VSCode"
            />
            <Badge
                icon="material-icon-theme:docker"
                label="Docker"
            />
            <Badge
                icon="material-icon-theme:git"
                label="Git"
            />
            <Badge
                img="trae-color.svg"
                label="Trae"
            />
          </div>
        </div>
      </div>
    </div>
    <!--    短斜渐近线-->
    <div class="flex justify-center transform bg-gray-900 scale-125">
      <div class="items-start space-y-8 px-8 leading-relaxed ">
        <p class="text-white text-xl font-light leading-relaxed transform translate-x-4">
          去试了才知道自己行不行
        </p>
        <p class="text-white text-xl font-light leading-relaxed transform translate-x-8">
          不去试，就永远不知道自己行不行
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import head from "~~/public/头像.jpg"
</script>

<style>

</style>