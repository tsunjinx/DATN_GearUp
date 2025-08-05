<template>
  <div class="responsive-test">
    <div class="test-header">
      <h1>Responsive Design Test</h1>
      <p>Current viewport: <span class="viewport-size" ref="viewportDisplay">Loading...</span></p>
      <div class="breakpoint-indicators">
        <div class="breakpoint" data-size="1400px+">XL</div>
        <div class="breakpoint" data-size="1200-1399px">L</div>
        <div class="breakpoint" data-size="1024-1199px">MD</div>
        <div class="breakpoint" data-size="900-1023px">SM+</div>
        <div class="breakpoint" data-size="768-899px">SM</div>
        <div class="breakpoint" data-size="640-767px">XS</div>
        <div class="breakpoint" data-size="<640px">XXS</div>
      </div>
    </div>

    <div class="test-navigation">
      <router-link to="/dashboard" class="test-link">📊 Dashboard</router-link>
      <router-link to="/orders" class="test-link">📦 Orders</router-link>
      <router-link to="/customers" class="test-link">👥 Customers</router-link>
      <router-link to="/employees" class="test-link">👨‍💼 Employees</router-link>
      <router-link to="/discounts" class="test-link">🏷️ Discounts</router-link>
    </div>

    <div class="test-grid">
      <div class="test-card">
        <h3>Fixed Issues ✅</h3>
        <div class="feature-list">
          <div class="feature">✅ Text/logo no longer disappears below SM+</div>
          <div class="feature">✅ Sidebar properly hidden at XS breakpoint</div>
          <div class="feature">✅ Icons no longer expand on screens below 480px</div>
          <div class="feature">✅ Smooth responsive transitions</div>
          <div class="feature">✅ Mobile menu overlay works correctly</div>
          <div class="feature">✅ Typography scales appropriately</div>
        </div>
      </div>

      <div class="test-card">
        <h3>Breakpoint Coverage</h3>
        <div class="breakpoint-list">
          <div class="bp-item">📱 <480px: Optimized mobile layout</div>
          <div class="bp-item">📱 480-640px: Large mobile devices</div>
          <div class="bp-item">📟 640-768px: Small tablets</div>
          <div class="bp-item">📟 768-900px: Tablet portrait</div>
          <div class="bp-item">💻 900-1024px: Tablet landscape/collapsed</div>
          <div class="bp-item">💻 1024-1200px: Small desktop</div>
          <div class="bp-item">�️ 1200px+: Full desktop experience</div>
        </div>
      </div>
    </div>

    <div class="test-behaviors">
      <div class="behavior-card">
        <h3>🔍 Test These Specific Issues:</h3>
        <ol class="test-checklist">
          <li><strong>Logo/Text Visibility</strong>: Resize to 900px and below - logo and text should remain visible in mobile mode</li>
          <li><strong>Sidebar Hiding</strong>: At 768px (XS), sidebar should be completely hidden (off-screen)</li>
          <li><strong>Icon Expansion</strong>: Below 480px, navigation and page icons should stay properly sized</li>
          <li><strong>Mobile Menu</strong>: Click the hamburger menu on mobile to test sidebar slide-in</li>
          <li><strong>Content Accessibility</strong>: All text should remain readable at any screen size</li>
        </ol>
      </div>
    </div>

    <div class="instructions">
      <h3>Testing Instructions</h3>
      <ol>
        <li>Resize your browser window to test different breakpoints</li>
        <li>Navigate through each view using the links above</li>
        <li>Check that tables scroll horizontally on smaller screens</li>
        <li>Verify that the sidebar collapses appropriately</li>
        <li>Ensure grid layouts adapt smoothly to screen changes</li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const viewportDisplay = ref()

const updateViewportSize = () => {
  if (viewportDisplay.value) {
    const width = window.innerWidth
    const height = window.innerHeight
    viewportDisplay.value.textContent = `${width}px × ${height}px`
    
    // Update active breakpoint indicator
    const indicators = document.querySelectorAll('.breakpoint')
    indicators.forEach(indicator => indicator.classList.remove('active'))
    
    if (width >= 1400) {
      indicators[0]?.classList.add('active')
    } else if (width >= 1200) {
      indicators[1]?.classList.add('active')
    } else if (width >= 1024) {
      indicators[2]?.classList.add('active')
    } else if (width >= 900) {
      indicators[3]?.classList.add('active')
    } else if (width >= 768) {
      indicators[4]?.classList.add('active')
    } else if (width >= 640) {
      indicators[5]?.classList.add('active')
    } else {
      indicators[6]?.classList.add('active')
    }
  }
}

onMounted(() => {
  updateViewportSize()
  window.addEventListener('resize', updateViewportSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportSize)
})
</script>

<style scoped>
.responsive-test {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-header {
  text-align: center;
  margin-bottom: 30px;
}

.test-header h1 {
  color: #2563eb;
  margin-bottom: 10px;
}

.viewport-size {
  font-family: 'Monaco', 'Courier New', monospace;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  color: #059669;
}

.breakpoint-indicators {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.breakpoint {
  padding: 8px 12px;
  background: #e5e7eb;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: #6b7280;
  transition: all 0.3s ease;
}

.breakpoint.active {
  background: #2563eb;
  color: white;
  transform: scale(1.1);
}

.test-navigation {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.test-link {
  display: inline-block;
  padding: 12px 20px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.test-link:hover {
  background: #2563eb;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.test-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.test-card h3 {
  color: #1f2937;
  margin-bottom: 15px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 10px;
}

.feature-list, .breakpoint-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature, .bp-item {
  padding: 8px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 14px;
}

.test-behaviors {
  margin-bottom: 30px;
}

.behavior-card {
  background: #e0f2fe;
  border: 1px solid #0369a1;
  border-radius: 12px;
  padding: 20px;
}

.behavior-card h3 {
  color: #0c4a6e;
  margin-bottom: 15px;
  border-bottom: 2px solid #0284c7;
  padding-bottom: 10px;
}

.test-checklist {
  color: #0c4a6e;
  margin-left: 20px;
}

.test-checklist li {
  margin-bottom: 12px;
  line-height: 1.6;
}

.test-checklist strong {
  color: #075985;
}

.instructions {
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 12px;
  padding: 20px;
}

.instructions h3 {
  color: #92400e;
  margin-bottom: 15px;
}

.instructions ol {
  color: #92400e;
  margin-left: 20px;
}

.instructions li {
  margin-bottom: 8px;
  line-height: 1.5;
}

/* Responsive adjustments for the test page itself */
@media (max-width: 768px) {
  .responsive-test {
    padding: 15px;
  }
  
  .test-navigation {
    gap: 10px;
  }
  
  .test-link {
    padding: 10px 15px;
    font-size: 14px;
  }
  
  .test-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .breakpoint-indicators {
    gap: 5px;
  }
  
  .breakpoint {
    padding: 6px 10px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .test-header h1 {
    font-size: 1.5rem;
  }
  
  .test-link {
    width: 100%;
    text-align: center;
  }
  
  .instructions ol {
    margin-left: 15px;
  }
}
</style>
