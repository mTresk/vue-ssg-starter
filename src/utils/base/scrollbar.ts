import Scrollbar from 'smooth-scrollbar'

function initScrollbar() {
  const scrollElements = document.querySelectorAll<HTMLElement>('[data-scrollbar]')

  if (!scrollElements.length) {
    return
  }

  scrollElements.forEach((scrollElement) => {
    Scrollbar.init(scrollElement, {
      alwaysShowTracks: true,
      continuousScrolling: false,
    })
  })
}

window.addEventListener('DOMContentLoaded', () => {
  initScrollbar()
})
