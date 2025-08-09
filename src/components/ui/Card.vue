<!-- Thành phần thẻ (Card) dùng chung: chứa header/body/footer để bọc nội dung, đảm bảo giao diện thống nhất. -->
<template>
  <section class="gu-card" :class="{ 'gu-card--hover': hover }">
    <header v-if="$slots.header" class="gu-card__header">
      <slot name="header" />
    </header>
    <div class="gu-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="gu-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup>
defineProps({
  hover: { type: Boolean, default: false }
})
</script>

<style scoped>
.gu-card {
  background: #fff;
  border: 1px solid var(--border-light);
  border-radius: var(--card-radius, var(--radius-lg));
  box-shadow: var(--card-shadow, var(--shadow-sm));
  overflow: hidden;
}
.gu-card--hover:hover { box-shadow: var(--card-hover-shadow, var(--shadow-md)); }

.gu-card__header { padding: var(--card-padding, 1.25rem); border-bottom: 1px solid var(--border-light); background: var(--gray-50); }
.gu-card__body { padding: var(--card-padding, 1.25rem); }
.gu-card__footer { padding: var(--card-padding, 1.25rem); border-top: 1px solid var(--border-light); background: var(--gray-50); }
</style>


