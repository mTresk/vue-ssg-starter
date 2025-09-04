import NiceSelect from 'nice-select2'

function initSelects() {
  const selectElements = document.querySelectorAll<HTMLElement>('[data-select]')

  if (!selectElements.length) {
    return
  }

  selectElements.forEach((select) => {
    new NiceSelect(select, {
      placeholder: select.dataset.placeholder,
      searchable: false,
    })
  })
}

window.addEventListener('DOMContentLoaded', () => {
  initSelects()
})
