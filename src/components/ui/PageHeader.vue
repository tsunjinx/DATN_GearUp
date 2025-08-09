<template>
  <div class="page-header">
    <div class="left">
      <span v-if="icon" class="icon" aria-hidden="true">{{ icon }}</span>
      <div class="titles">
        <h1 class="title">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="subtitle">
          {{ subtitle }}
        </p>
      </div>
    </div>
    <div class="right">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: '' },
  subtitle: { type: String, default: '' }
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: var(--spacing-md);
  color: var(--gray-700);
}
.left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon {
  font-size: 20px;
}
.titles {
  display: flex;
  flex-direction: column;
}
.title {
  margin: 0;
  padding: 0;
  font-weight: 800;
  color: var(--gray-900);
  font-size: 1.125rem;
}
.subtitle {
  margin: 0;
  color: var(--gray-600);
  font-size: 0.875rem;
}
.right {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
