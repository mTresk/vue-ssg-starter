import tippy from 'tippy.js'

function initTippy() {
  tippy('[data-tippy-content]', {
    theme: 'light',
    arrow: false,
  })
}

window.addEventListener('DOMContentLoaded', () => {
  initTippy()
})
