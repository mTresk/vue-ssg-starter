function fileField() {
  const fields = document.querySelectorAll('[data-file]') as NodeListOf<HTMLElement>

  if (!fields.length) {
    return
  }

  fields.forEach((field) => {
    const input = field.querySelector('[data-file-input]') as HTMLInputElement
    const text = field.querySelector('[data-file-text]') as HTMLElement

    if (!input || !text) {
      return
    }

    input.addEventListener('change', () => {
      const file = input.files?.[0]

      if (!file) {
        return
      }

      text.textContent = file.name || 'Файл не выбран'
      field.setAttribute('data-file-attached', '')
    })
  })
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => fileField())
})
