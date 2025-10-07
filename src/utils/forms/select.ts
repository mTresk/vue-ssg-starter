import NiceSelect from 'nice-select2'

function initSelect() {
  const elements = document.querySelectorAll<HTMLElement>('[data-select]')

  if (!elements.length) {
    return
  }

  elements.forEach((element) => {
    new NiceSelect(element, {
      placeholder: element.dataset.placeholder,
      searchable: false,
    })
  })
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => initSelect())
})
