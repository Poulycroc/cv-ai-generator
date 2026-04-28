<template>
  <header class="cv-header">
    <div class="cv-header__banner">
      <h1 class="cv-header__name">{{ sidebar.name }}</h1>
    </div>
    <div class="cv-header__intro">
      <img
        :src="sidebar.photoDataUrl"
        :alt="sidebar.name"
        class="cv-header__photo"
      />
      <div class="cv-header__title-block">
        <h2 class="cv-header__job-title">{{ title.jobTitle }}</h2>
        <div class="cv-header__summary" v-html="title.summaryHtml"></div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { SidebarData, TitleData } from '../types/content'

defineProps<{
  sidebar: SidebarData
  title: TitleData
}>()
</script>
