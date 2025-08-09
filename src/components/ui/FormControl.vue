<!-- Trường nhập liệu dùng chung (FormControl): hỗ trợ input/textarea/select, có label, hint, error để tái sử dụng đồng nhất. -->
<template>
  <label class="gu-field">
    <span v-if="label" class="gu-field__label">
      {{ label }}
      <span v-if="required" aria-hidden="true" class="gu-req">*</span>
    </span>
    <div class="gu-field__control">
      <input
        v-if="as === 'input'"
        class="gu-input"
        :type="type"
        v-bind="$attrs"
      />
      <textarea
        v-else-if="as === 'textarea'"
        class="gu-input gu-input--textarea"
        v-bind="$attrs"
      />
      <select v-else class="gu-input" v-bind="$attrs">
        <slot />
      </select>
    </div>
    <small v-if="hint" class="gu-field__hint">{{ hint }}</small>
    <small v-if="error" class="gu-field__error">{{ error }}</small>
  </label>
</template>

<script setup>
defineOptions({ inheritAttrs: false })

defineProps({
  as: { type: String, default: 'input' },
  type: { type: String, default: 'text' },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false }
})
</script>

<style scoped>
.gu-field { display: grid; gap: 0.375rem; }
.gu-field__label { color: var(--gray-700); font-weight: 600; font-size: 0.875rem; }
.gu-req { color: var(--error); margin-left: 2px; }

.gu-input {
  width: 100%;
  min-height: var(--form-input-height, 40px);
  padding: var(--form-input-padding, 12px);
  background: #fff;
  border: var(--form-input-border, 1px solid var(--border));
  border-radius: var(--form-input-radius, var(--radius-lg));
  font-size: 0.875rem;
  color: var(--gray-800);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.gu-input:focus { outline: none; border-color: var(--primary-400); box-shadow: 0 0 0 3px rgba(74,222,128,0.15); }
.gu-input::placeholder { color: var(--gray-400); }
.gu-input--textarea { min-height: 96px; resize: vertical; }

.gu-field__hint { color: var(--gray-500); font-size: 0.75rem; }
.gu-field__error { color: var(--error); font-size: 0.75rem; font-weight: 600; }
</style>


