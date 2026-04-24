<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { computed } from "vue"
import { Primitive } from "reka-ui"
import { cn } from "@core/lib/utils"
import type { ButtonVariants } from "@core/lib/button-variants"

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
})

const buttonClass = computed(() =>
  cn(
    "ui-button",
    `ui-button--${props.variant ?? "default"}`,
    `ui-button--${props.size ?? "default"}`,
    props.class,
  ),
)
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :class="buttonClass"
  >
    <slot />
  </Primitive>
</template>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.ui-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.ui-button:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

.ui-button--default {
  background: var(--primary);
  color: var(--primary-foreground);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
}

.ui-button--default:not(:disabled):hover {
  filter: brightness(0.95);
}

.ui-button--destructive {
  background: var(--destructive);
  color: var(--destructive-foreground);
}

.ui-button--outline {
  background: var(--background);
  border-color: var(--border);
  color: var(--foreground);
}

.ui-button--outline:not(:disabled):hover,
.ui-button--ghost:not(:disabled):hover {
  background: var(--accent);
  color: var(--accent-foreground);
}

.ui-button--secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
}

.ui-button--secondary:not(:disabled):hover {
  filter: brightness(0.98);
}

.ui-button--ghost {
  background: transparent;
  color: var(--foreground);
}

.ui-button--link {
  background: transparent;
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 0.2em;
  border-color: transparent;
  padding-left: 0;
  padding-right: 0;
}

.ui-button--default,
.ui-button--outline,
.ui-button--secondary,
.ui-button--ghost,
.ui-button--destructive {
  min-height: 2.5rem;
  padding: 0.7rem 1rem;
}

.ui-button--sm {
  min-height: 2.1rem;
  padding: 0.5rem 0.8rem;
  font-size: 0.875rem;
}

.ui-button--lg {
  min-height: 2.75rem;
  padding: 0.8rem 1.3rem;
}

.ui-button--icon {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
}
</style>
