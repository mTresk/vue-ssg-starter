import Scrollbar from 'smooth-scrollbar'

function initScrollbar() {
  const elements = document.querySelectorAll<HTMLElement>('[data-scrollbar]')

  if (!elements.length) {
    return
  }

  elements.forEach((element) => {
    Scrollbar.init(element, {
      alwaysShowTracks: true,
      continuousScrolling: false,
    })
  })
}

window.addEventListener('DOMContentLoaded', () => {
  initScrollbar()
})
