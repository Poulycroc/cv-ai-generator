<template>
  <div class="cl-page">
    <div class="cl-sender">
      <div class="cl-sender__name">{{ content.sender.name }}</div>
      <div class="cl-sender__detail">{{ content.sender.address }}</div>
      <div class="cl-sender__detail">
        <a :href="'mailto:' + content.sender.email">{{ content.sender.email }}</a>
      </div>
      <div class="cl-sender__detail">{{ content.sender.website }}</div>
    </div>

    <div class="cl-meta">
      <div class="cl-meta__date">{{ content.city }}, {{ content.date }}</div>
    </div>

    <div class="cl-recipient">
      {{ content.recipient }}
    </div>

    <div class="cl-body" v-html="content.bodyHtml"></div>

    <div class="cl-signature">
      {{ content.sender.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import content from 'virtual:cover-letter-content'
</script>
