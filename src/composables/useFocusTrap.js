// Simple focus trap composable for modals and drawers
import { ref } from 'vue'

const FOCUSABLE = [
  'a[href]','button:not([disabled])','textarea:not([disabled])','input:not([disabled])','select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

export function useFocusTrap() {
  const activeRoot = ref(null)
  const lastFocused = ref(null)
  const onKeydown = (e) => {
    if (!activeRoot.value) return
    if (e.key !== 'Tab') return
    const nodes = activeRoot.value.querySelectorAll(FOCUSABLE)
    if (!nodes.length) return
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    const current = document.activeElement
    if (e.shiftKey) {
      if (current === first || !activeRoot.value.contains(current)) {
        e.preventDefault(); last.focus()
      }
    } else {
      if (current === last || !activeRoot.value.contains(current)) {
        e.preventDefault(); first.focus()
      }
    }
  }

  const activate = (rootEl) => {
    if (!rootEl) return
    lastFocused.value = document.activeElement
    activeRoot.value = rootEl
    document.addEventListener('keydown', onKeydown)
    // Focus first focusable
    const nodes = rootEl.querySelectorAll(FOCUSABLE)
    if (nodes.length) nodes[0].focus()
    else rootEl.setAttribute('tabindex', '-1'), rootEl.focus()
  }

  const deactivate = () => {
    document.removeEventListener('keydown', onKeydown)
    activeRoot.value = null
    if (lastFocused.value && typeof lastFocused.value.focus === 'function') {
      lastFocused.value.focus()
    }
    lastFocused.value = null
  }

  return { activate, deactivate }
}




