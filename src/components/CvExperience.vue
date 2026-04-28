<template>
  <section>
    <h3 class="cv-section-title">{{ experience.sectionTitle }}</h3>
    <div
      v-for="(entry, i) in experience.entries"
      :key="i"
      class="cv-experience__entry"
    >
      <div>
        <span class="cv-experience__role">{{ entry.role }}</span>
        <span v-if="entry.dates" class="cv-experience__dates">
          ({{ entry.dates }})
        </span>
      </div>
      <div v-if="entry.company" class="cv-experience__company">
        {{ entry.company }}
      </div>
      <ul v-if="entry.bullets.length" class="cv-experience__bullets">
        <li
          v-for="(bullet, j) in entry.bullets"
          :key="j"
          class="cv-experience__bullet"
        >
          {{ bullet }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ExperienceData } from '../types/content'

defineProps<{
  experience: ExperienceData
}>()
</script>
