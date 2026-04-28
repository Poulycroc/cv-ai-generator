<template>
  <section>
    <h3 class="cv-section-title">{{ education.sectionTitle }}</h3>
    <div
      v-for="(entry, i) in education.entries"
      :key="i"
      class="cv-education__entry"
    >
      <span class="cv-education__school">{{ entry.school }}</span>
      <span v-if="entry.program" class="cv-education__program">
        - {{ entry.program }}
      </span>
      <span v-if="entry.dates" class="cv-education__dates">
        - {{ entry.dates }}
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { EducationData } from '../types/content'

defineProps<{
  education: EducationData
}>()
</script>
