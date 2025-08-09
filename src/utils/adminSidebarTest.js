/**
 * Admin Sidebar Test Script
 *
 * This script tests the "always open" sidebar behavior for the admin site.
 * Run this in browser console after navigating to any admin page.
 */

// Test function to verify sidebar is always open on admin access
function testAdminSidebarAlwaysOpen() {
  console.log('🧪 Testing Admin Sidebar "Always Open" Behavior...\n')

  // Check if we're on admin route
  const isAdminRoute = window.location.pathname.startsWith('/admin')
  console.log('📍 Current route:', window.location.pathname)
  console.log('🎯 Is admin route:', isAdminRoute)

  if (!isAdminRoute) {
    console.warn('⚠️ Not on admin route. Navigate to /admin/dashboard to test.')
    return
  }

  // Check sidebar elements
  const sidebar = document.querySelector('.sidebar')
  const sidebarCollapsed = sidebar?.classList.contains('sidebar-collapsed')

  console.log('📊 Sidebar state:')
  console.log('  - Element found:', !!sidebar)
  console.log('  - Is collapsed:', sidebarCollapsed)
  console.log('  - CSS classes:', sidebar?.className)

  // Check Vue app state if available
  if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('🔍 Vue DevTools detected - checking reactive state...')
  }

  // Check if sidebar shows navigation text (indicates expanded state)
  const navTexts = document.querySelectorAll('.nav-text')
  const visibleNavTexts = Array.from(navTexts).filter(text => {
    const style = window.getComputedStyle(text)
    return style.opacity !== '0' && style.display !== 'none'
  })

  console.log('🗂️ Navigation text visibility:')
  console.log('  - Total nav items:', navTexts.length)
  console.log('  - Visible nav texts:', visibleNavTexts.length)
  console.log('  - Shows text (expanded):', visibleNavTexts.length > 0)

  // Check responsive behavior
  const isMobile = window.innerWidth <= 768
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024
  const isDesktop = window.innerWidth > 1024

  console.log('📱 Screen size analysis:')
  console.log('  - Width:', window.innerWidth + 'px')
  console.log('  - Is mobile:', isMobile)
  console.log('  - Is tablet:', isTablet)
  console.log('  - Is desktop:', isDesktop)

  // Expected behavior
  const shouldBeOpen = !isMobile // Should be open on tablet and desktop
  const actuallyOpen = !sidebarCollapsed && visibleNavTexts.length > 0

  console.log('\n✅ Test Results:')
  console.log('  - Should be open:', shouldBeOpen)
  console.log('  - Actually open:', actuallyOpen)
  console.log('  - Test passed:', shouldBeOpen === actuallyOpen)

  if (shouldBeOpen === actuallyOpen) {
    console.log('🎉 SUCCESS: Sidebar behavior is correct!')
  } else {
    console.log('❌ FAILURE: Sidebar behavior is incorrect!')
  }

  return {
    isAdminRoute,
    shouldBeOpen,
    actuallyOpen,
    testPassed: shouldBeOpen === actuallyOpen,
    screenWidth: window.innerWidth,
    isMobile,
    isTablet,
    isDesktop
  }
}

// Test localStorage reset function
function testSidebarReset() {
  console.log('🔄 Testing sidebar reset function...')

  if (typeof window.resetSidebar === 'function') {
    window.resetSidebar()
    console.log('✅ Reset function executed successfully')

    // Re-run main test after reset
    setTimeout(() => {
      console.log('🔄 Re-testing after reset...')
      testAdminSidebarAlwaysOpen()
    }, 1000)
  } else {
    console.warn('⚠️ Reset function not available (only in development)')
  }
}

// Export functions for manual testing
window.testAdminSidebarAlwaysOpen = testAdminSidebarAlwaysOpen
window.testSidebarReset = testSidebarReset

// Auto-run test if on admin route
if (window.location.pathname.startsWith('/admin')) {
  console.log('🚀 Auto-running admin sidebar test...')
  setTimeout(testAdminSidebarAlwaysOpen, 500) // Allow for Vue to mount
}

console.log(`
📋 Admin Sidebar Test Functions Available:
  - testAdminSidebarAlwaysOpen() - Test current sidebar state  
  - testSidebarReset() - Reset and re-test sidebar
  
🎯 Expected Behavior:
  - Desktop/Tablet: Sidebar always starts open
  - Mobile: Sidebar starts closed (overlay behavior)
  - User can still toggle, but always starts open on fresh load
`)
