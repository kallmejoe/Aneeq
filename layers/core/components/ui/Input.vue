<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { useVModel } from "@vueuse/core"
import { cn } from "@core/lib/utils"

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes["class"]
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void
}>()

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="cn('ui-input', props.class)"
  >
</template>

<style scoped>
.ui-input {
  width: 100%;
  min-height: 2rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--input);
  border-radius: calc(var(--radius) - 2px);
  background: var(--background);
  color: var(--foreground);
  font-size: 0.875rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.ui-input::placeholder {
  color: var(--muted-foreground);
}

.ui-input:focus {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  border-color: var(--ring);
}

.ui-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
