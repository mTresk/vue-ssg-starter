function agreement() {
  const forms = document.querySelectorAll('[data-form]') as NodeListOf<HTMLFormElement>

  if (!forms.length) {
    return
  }

  forms.forEach((form) => {
    const submitButton = form?.querySelector('[data-submit]') as HTMLButtonElement
    const checkbox = form?.querySelector('[data-checkbox]') as HTMLInputElement

    if (!submitButton || !checkbox) {
      return
    }

    const updateSubmitButton = () => {
      if (checkbox.checked) {
        submitButton.removeAttribute('disabled')
      }
      else {
        submitButton.setAttribute('disabled', 'true')
      }
    }

    updateSubmitButton()

    checkbox.addEventListener('change', updateSubmitButton)
  })
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => agreement())
})
