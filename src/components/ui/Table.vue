<!-- Bảng trình bày dữ liệu (Table) đơn giản: slot head/body để hiển thị tiêu đề cột và hàng nội dung. -->
<template>
  <div class="gu-table__wrapper">
    <table class="gu-table">
      <thead v-if="$slots.head">
        <tr><slot name="head" /></tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup>
// Presentational table wrapper
</script>

<style scoped>
.gu-table__wrapper { width: 100%; overflow-x: auto; }
.gu-table { width: 100%; border-collapse: collapse; background: #fff; }
.gu-table th, .gu-table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-light); font-size: 0.875rem; text-align: left; }
.gu-table th { background: var(--gray-50); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; font-size: 0.75rem; color: var(--gray-700); }
.gu-table tbody tr:hover { background: var(--gray-50); }
</style>


