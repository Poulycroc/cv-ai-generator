<template>
  <section>
    <h3 class="cv-section-title">{{ skills.sectionTitle }}</h3>
    <div class="cv-skills__grid">
      <div class="cv-skills__column">
        <div
          v-for="(cat, i) in leftColumn"
          :key="i"
          class="cv-skills__category"
        >
          <div class="cv-skills__category-name">{{ cat.name }}</div>
          <ul class="cv-skills__items">
            <li v-for="(item, j) in cat.items" :key="j" class="cv-skills__item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div class="cv-skills__column">
        <div
          v-for="(cat, i) in rightColumn"
          :key="i"
          class="cv-skills__category"
        >
          <div class="cv-skills__category-name">{{ cat.name }}</div>
          <ul class="cv-skills__items">
            <li v-for="(item, j) in cat.items" :key="j" class="cv-skills__item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SkillsData } from '../types/content'

const props = defineProps<{
  skills: SkillsData
}>()

const mid = computed(() => Math.ceil(props.skills.categories.length / 2))
const leftColumn = computed(() => props.skills.categories.slice(0, mid.value))
const rightColumn = computed(() => props.skills.categories.slice(mid.value))
</script>
