import NiceSelect from 'nice-select2'

const selectInstances = new Map<HTMLElement, any>()

function initSelect() {
  const elements = document.querySelectorAll<HTMLElement>('[data-select]')

  if (!elements.length) {
    return
  }

  elements.forEach((element) => {
    const instance = new NiceSelect(element, {
      placeholder: element.dataset.placeholder,
      searchable: false,
    })

    selectInstances.set(element, instance)
  })
}

export function updateSelect(element: HTMLElement) {
  const instance = selectInstances.get(element)

  if (instance && instance.update) {
    instance.update()
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => initSelect())
})
