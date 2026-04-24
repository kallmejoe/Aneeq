<script setup lang="ts">
import type { LabelProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { Label } from "reka-ui"
import { cn } from "@core/lib/utils"

const props = defineProps<LabelProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <Label
    data-slot="label"
    v-bind="delegatedProps"
    :class="cn('ui-label', props.class)"
  >
    <slot />
  </Label>
</template>

<style scoped>
.ui-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--foreground);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
}
</style>
