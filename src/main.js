// Critical CSS imports first for faster rendering
import './assets/critical.css'
import './assets/variables.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Performance optimization: Create app instance immediately
const app = createApp(App)

// Add plugins with error handling
try {
  app.use(createPinia())
  app.use(router)
} catch (error) {
  console.error('Plugin initialization error:', error)
}

// Service Worker Registration
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration.scope)
      })
      .catch(error => {
        console.log('SW registration failed:', error)
      })
  })
}

// Hide loading screen and mount app
const hideLoadingScreen = () => {
  const loadingScreen = document.querySelector('.loading-screen')
  if (loadingScreen) {
    loadingScreen.style.display = 'none'
  }
}

// Mount app with performance tracking
const startTime = performance.now()
app.mount('#app')

// Track mounting performance and lazy load remaining CSS
requestAnimationFrame(() => {
  hideLoadingScreen()
  const mountTime = performance.now() - startTime
  console.log(`App mounted in ${mountTime.toFixed(2)}ms`)
  
  // Lazy load non-critical CSS after initial render
  Promise.all([
    import('./style.css'),
    import('./assets/button-animations.css')
  ]).then(() => {
    console.log('Non-critical CSS loaded')
    
    // Performance monitoring
    if (window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0]
      console.log('Performance Metrics:', {
        'FCP': performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        'LCP': performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
        'DOMContentLoaded': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        'Load': navigation.loadEventEnd - navigation.loadEventStart
      })
    }
  })
})
