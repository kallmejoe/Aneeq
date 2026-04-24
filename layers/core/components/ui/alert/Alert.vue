<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { computed } from "vue"
import { cn } from "@core/lib/utils"
import type { AlertVariants } from "@core/lib/alert-variants"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  variant?: AlertVariants["variant"]
}>()

const alertClass = computed(() =>
  cn("ui-alert", `ui-alert--${props.variant ?? "default"}`, props.class),
)
</script>

<template>
  <div
    data-slot="alert"
    :class="alertClass"
    role="alert"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-alert {
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  color: var(--card-foreground);
}

.ui-alert--destructive {
  border-color: color-mix(in srgb, var(--destructive) 35%, var(--border));
  background: color-mix(in srgb, var(--destructive) 8%, var(--background));
  color: var(--destructive);
}
</style>
