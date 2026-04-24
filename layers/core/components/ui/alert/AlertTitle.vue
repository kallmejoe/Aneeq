<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@core/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="alert-title"
    :class="cn('ui-alert-title', props.class)"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-alert-title {
  font-weight: 700;
  letter-spacing: -0.01em;
}
</style>
