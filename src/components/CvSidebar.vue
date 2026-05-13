<template>
  <aside class="cv-sidebar">
    <div class="cv-sidebar__banner">
      <h1 class="cv-sidebar__name">{{ sidebar.name }}</h1>
    </div>

    <div class="cv-sidebar__picture">
      <img
        :src="profilePic"
        :alt="sidebar.name"
        class="cv-sidebar__photo"
      />
    </div>

    <div class="cv-sidebar__info">
      <div v-if="hasIonfo(sidebar.birthdate)" class="cv-sidebar__section">
        <div class="cv-sidebar__label">{{ labels.birthdate }}</div>
        <div class="cv-sidebar__value">{{ sidebar.birthdate }}</div>
      </div>

      <div v-if="hasIonfo(sidebar.address)" class="cv-sidebar__section">
        <div class="cv-sidebar__label">{{ labels.address }}</div>
        <div class="cv-sidebar__value">{{ sidebar.address }}</div>
      </div>

      <div v-if="hasIonfo(sidebar.phone)" class="cv-sidebar__section">
        <div class="cv-sidebar__label">{{ labels.phone }}</div>
        <div class="cv-sidebar__value">{{ sidebar.phone }}</div>
      </div>

      <div class="cv-sidebar__section">
        <div class="cv-sidebar__label">{{ labels.email }}</div>
        <div class="cv-sidebar__value">
          <a :href="'mailto:' + sidebar.email" class="cv-sidebar__link">
            {{ sidebar.email }}
          </a>
        </div>
      </div>

      <div class="cv-sidebar__section">
        <div class="cv-sidebar__label">{{ labels.website }}</div>
        <div class="cv-sidebar__value">
          <a
            :href="'https://' + sidebar.website"
            class="cv-sidebar__link"
            target="_blank"
          >
            {{ sidebar.website }}
          </a>
        </div>
      </div>

      <div class="cv-sidebar__section">
        <div class="cv-sidebar__label">{{ labels.languages }}</div>
        <div
          v-for="lang in sidebar.languages"
          :key="lang.name"
          class="cv-sidebar__lang-item"
        >
          <div>
            <span class="cv-sidebar__lang-name">{{ lang.name }}:</span>
            <span class="cv-sidebar__lang-level"> {{ lang.level }}</span>
          </div>
        </div>
      </div>

      <div class="cv-sidebar__section">
        <div class="cv-sidebar__label">{{ labels.mobility }}</div>
        <div class="cv-sidebar__value">{{ sidebar.mobility }}</div>
      </div>

      <div class="cv-sidebar__section">
        <div class="cv-sidebar__label">{{ labels.interests }}</div>
        <div class="cv-sidebar__interests">
          {{ sidebar.interests.join(" · ") }}
        </div>
      </div>
    </div>

    <div v-if="education" class="cv-sidebar__info">
      <div class="cv-sidebar__section">
        <div class="cv-sidebar__label">{{ labels.education }}</div>
        <div
          v-for="(entry, i) in education.entries"
          :key="i"
          class="cv-sidebar__education-entry"
        >
          <div class="cv-sidebar__education-school">{{ entry.school }}</div>
          <div v-if="entry.program" class="cv-sidebar__education-program">{{ entry.program }}</div>
          <div v-if="entry.dates" class="cv-sidebar__education-dates">{{ entry.dates }}</div>
        </div>
      </div>
    </div>

    <div class="cv-sidebar__footer">
      <div class="cv-sidebar__logo" v-html="sidebar.logoSvg"></div>
      <div class="cv-sidebar__qr" v-html="sidebar.qrSvg"></div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SidebarData, EducationData } from "../types/content";
import profilePic from "../../content/shared/profile-pic.jpg";

const props = defineProps<{
  sidebar: SidebarData;
  lang: "fr" | "en";
  education?: EducationData;
}>();

const i18n: Record<string, Record<string, string>> = {
  fr: {
    birthdate: "Date de naissance",
    address: "Adresse",
    phone: "Téléphone",
    email: "Email",
    website: "Site web",
    languages: "Langues",
    mobility: "Mobilité",
    interests: "Centres d'intérêts",
    education: "Formation",
  },
  en: {
    birthdate: "Date of birth",
    address: "Address",
    phone: "Phone",
    email: "Email",
    website: "Website",
    languages: "Languages",
    mobility: "Driving license",
    interests: "Interests",
    education: "Education",
  },
};

const labels = computed(() => i18n[props.lang] || i18n.fr);

/**
 * Check if the sidebar has any info to display
 * @returns {boolean} True if there is at least one info to display, false otherwise
 */
function hasIonfo(item): boolean {
	return item && item !== '' && (Array.isArray(item) ? item.length > 0 : true);
}
</script>
