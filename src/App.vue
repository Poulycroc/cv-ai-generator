<template>
  <div class="cv-page">
    <span class="cv-keywords">{{ content.config.keywords.join(', ') }}</span>
    <div class="cv-body">
      <CvSidebar :sidebar="content.sidebar" :lang="content.config.lang" />
      <main class="cv-main">
        <h2 class="cv-main__title">{{ content.title.jobTitle }}</h2>
        <div class="cv-main__summary" v-html="content.title.summaryHtml"></div>
        <CvExperience :experience="content.experience" />
        <CvSkills :skills="content.skills" />
        <CvEducation :education="content.education" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import content from 'virtual:cv-content'
import CvSidebar from './components/CvSidebar.vue'
import CvExperience from './components/CvExperience.vue'
import CvSkills from './components/CvSkills.vue'
import CvEducation from './components/CvEducation.vue'
</script>
