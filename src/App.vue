<script setup>
import { RouterView, useRoute } from 'vue-router'
import { watch, onMounted } from 'vue'

const route = useRoute()

// Watch for route changes and update title
watch(
  () => route.meta.title,
  (newTitle) => {
    if (newTitle) {
      document.title = newTitle
    }
  },
  { immediate: true }
)

// Set initial title on app mount
onMounted(() => {
  const title = route.meta?.title || 'GearUp - Quản lý cửa hàng giày'
  document.title = title
})
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
/* Import Inter font for modern look */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  line-height: 1.6;
  font-size: 14px;
}

#app {
  min-height: 100vh;
}

/* CSS Variables for consistent theming */
:root {
  /* Primary Colors (Green from logo) */
  --primary-50: #f0fdf4;
  --primary-100: #dcfce7;
  --primary-200: #bbf7d0;
  --primary-300: #86efac;
  --primary-400: #4ade80;
  --primary-500: #22c55e;
  --primary-600: #16a34a;
  --primary-700: #15803d;
  --primary-800: #166534;
  --primary-900: #14532d;
  
  /* Gray Scale */
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
  
  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
  
  /* Component Colors */
  --background: #ffffff;
  --surface: #ffffff;
  --border: #e2e8f0;
  --border-light: #f1f5f9;
}

/* Global Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;

/* Global Icon and Emoji Controls */
.icon,
.nav-icon,
.page-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  line-height: 1;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  flex-shrink: 0;
}

/* Emoji specific controls to prevent expansion */
.nav-icon,
.page-icon {
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
  font-variant-emoji: emoji;
  text-align: center;
  vertical-align: middle;
  width: max-content;
  max-width: none;
}
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-500);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--gray-200);
}

.btn-success {
  background: var(--success);
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-outline {
  background: transparent;
  color: var(--primary-600);
  border: 1px solid var(--primary-300);
}

.btn-outline:hover:not(:disabled) {
  background: var(--primary-50);
}

/* Form Controls */
.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-400);
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.form-control::placeholder {
  color: var(--gray-400);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-700);
  font-size: 0.875rem;
}

/* Card Components */
.card {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid var(--border-light);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--gray-50);
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 0.5rem;
}

/* Status Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-success {
  background: var(--primary-100);
  color: var(--primary-800);
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.badge-error {
  background: #fecaca;
  color: #991b1b;
}

.badge-info {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-secondary {
  background: var(--gray-100);
  color: var(--gray-600);
}

/* Table Styles */
.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.table th,
.table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-light);
  font-size: 0.875rem;
}

.table th {
  background: var(--gray-50);
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table tbody tr:hover {
  background: var(--gray-50);
}

/* Loading Spinner */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Utility Classes */
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.text-primary { color: var(--primary-600); }
.text-success { color: var(--success); }
.text-warning { color: var(--warning); }
.text-error { color: var(--error); }
.text-gray { color: var(--gray-500); }

.bg-primary { background-color: var(--primary-500); }
.bg-success { background-color: var(--success); }
.bg-warning { background-color: var(--warning); }
.bg-error { background-color: var(--error); }

.border-primary { border-color: var(--primary-300); }
.border-success { border-color: var(--success); }

.rounded { border-radius: 0.5rem; }
.rounded-lg { border-radius: 0.75rem; }
.rounded-full { border-radius: 9999px; }

.shadow-sm { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
.shadow { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
.shadow-lg { box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); }

.grid { display: grid; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-4 { gap: 1rem; }

.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }

/* Responsive Utilities */
.hidden { display: none; }
.block { display: block; }
.inline-block { display: inline-block; }

.overflow-hidden { overflow: hidden; }
.overflow-auto { overflow: auto; }
.overflow-x-auto { overflow-x: auto; }
.overflow-y-auto { overflow-y: auto; }

.w-full { width: 100%; }
.h-full { height: 100%; }
.min-h-screen { min-height: 100vh; }

.flex-1 { flex: 1; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }

.space-x-2 > * + * { margin-left: 0.5rem; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-y-2 > * + * { margin-top: 0.5rem; }
.space-y-4 > * + * { margin-top: 1rem; }

/* Container */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Grid System */
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
.grid-cols-auto { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }

.col-span-1 { grid-column: span 1 / span 1; }
.col-span-2 { grid-column: span 2 / span 2; }
.col-span-3 { grid-column: span 3 / span 3; }
.col-span-full { grid-column: 1 / -1; }

/* Responsive Design System */
@media (min-width: 1920px) {
  /* 4K and ultra-wide monitors */
  .container { max-width: 1800px; }
  
  /* 4k: prefix utilities */
  .\34 k\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .\34 k\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .\34 k\:grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  .\34 k\:gap-8 { gap: 2rem; }
  .\34 k\:p-8 { padding: 2rem; }
  .\34 k\:text-lg { font-size: 1.125rem; }
}

@media (min-width: 1600px) {
  /* 2K and large desktop monitors */
  .container { max-width: 1536px; }
  
  /* 2k: prefix utilities */
  .\32 k\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .\32 k\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .\32 k\:gap-6 { gap: 1.5rem; }
  .\32 k\:p-6 { padding: 1.5rem; }
  .\32 k\:text-base { font-size: 1rem; }
}

@media (max-width: 1536px) {
  .container { max-width: 1280px; }
}

@media (max-width: 1280px) {
  .container { max-width: 1024px; }
  
  /* xl: prefix utilities */
  .xl\:hidden { display: none; }
  .xl\:block { display: block; }
  .xl\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .xl\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .xl\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (max-width: 1024px) {
  .container { max-width: 768px; }
  
  /* lg: prefix utilities */
  .lg\:hidden { display: none; }
  .lg\:block { display: block; }
  .lg\:flex { display: flex; }
  .lg\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .lg\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .lg\:flex-col { flex-direction: column; }
  .lg\:space-y-4 > * + * { margin-top: 1rem; margin-left: 0; }
  .lg\:p-4 { padding: 1rem; }
  .lg\:text-sm { font-size: 0.875rem; }
}

@media (max-width: 768px) {
  .container { 
    max-width: 640px; 
    padding: 0 0.75rem;
  }
  
  body {
    font-size: 13px;
  }
  
  /* md: prefix utilities */
  .md\:hidden { display: none; }
  .md\:block { display: block; }
  .md\:flex { display: flex; }
  .md\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .md\:flex-col { flex-direction: column; }
  .md\:space-y-2 > * + * { margin-top: 0.5rem; margin-left: 0; }
  .md\:space-y-4 > * + * { margin-top: 1rem; margin-left: 0; }
  .md\:p-3 { padding: 0.75rem; }
  .md\:text-xs { font-size: 0.75rem; }
  .md\:text-sm { font-size: 0.875rem; }
  
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .card-header {
    padding: 1rem;
  }
  
  .form-control {
    padding: 0.625rem;
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

@media (max-width: 640px) {
  .container { 
    max-width: 100%; 
    padding: 0 0.5rem;
  }
  
  /* sm: prefix utilities */
  .sm\:hidden { display: none; }
  .sm\:block { display: block; }
  .sm\:flex { display: flex; }
  .sm\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .sm\:flex-col { flex-direction: column; }
  .sm\:space-y-2 > * + * { margin-top: 0.5rem; margin-left: 0; }
  .sm\:p-2 { padding: 0.5rem; }
  .sm\:text-xs { font-size: 0.75rem; }
  
  .btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .card-body {
    padding: 0.75rem;
  }
  
  .card-header {
    padding: 0.75rem;
  }
  
  .table th,
  .table td {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.25rem;
  }
  
  body {
    font-size: 12px;
  }
  
  .btn {
    padding: 0.5rem 0.625rem;
    font-size: 0.7rem;
  }
  
  .card-body,
  .card-header {
    padding: 0.5rem;
  }
  
  .form-control {
    padding: 0.5rem;
  }
  
  .table th,
  .table td {
    padding: 0.375rem 0.5rem;
    font-size: 0.7rem;
  }
}

/* Touch and Interaction Improvements */
@media (hover: none) and (pointer: coarse) {
  /* Touch-friendly button sizes */
  .btn {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Remove hover effects on touch devices */
  .btn:hover:not(:disabled) {
    transform: none;
  }
  
  .btn:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  /* Touch-friendly table rows */
  .table tbody tr {
    cursor: pointer;
  }
  
  .table tbody tr:active {
    background: var(--gray-100);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --border: #000000;
    --border-light: #333333;
  }
  
  .btn {
    border: 2px solid currentColor;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print styles */
@media print {
  .btn,
  .sidebar,
  .top-header,
  .mobile-overlay {
    display: none !important;
  }
  
  .main-content {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .table {
    border-collapse: collapse;
  }
  
  .table th,
  .table td {
    border: 1px solid #000;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
  
  .btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }
  
  .card-body {
    padding: 1rem;
  }
}

/* Additional responsive fixes for small screens */
@media (max-width: 480px) {
  /* Prevent emoji/icon expansion on very small screens */
  .icon,
  .nav-icon,
  .page-icon {
    font-size: inherit !important;
    width: auto !important;
    max-width: 1.5rem !important;
    overflow: hidden !important;
    text-overflow: clip !important;
    white-space: nowrap !important;
  }
  
  /* Ensure proper spacing in navigation */
  .nav-link {
    align-items: center !important;
    gap: 0.5rem !important;
  }
  
  /* Control page header icon behavior */
  .page-title .page-icon {
    flex-shrink: 0 !important;
    width: 1.25rem !important;
    height: 1.25rem !important;
    font-size: 1.125rem !important;
  }
}
</style>
