<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@core/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="alert-description"
    :class="cn('ui-alert-description', props.class)"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-alert-description {
  color: inherit;
  font-size: 0.92rem;
  line-height: 1.5;
}
</style>
