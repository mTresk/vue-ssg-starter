import Inputmask from 'inputmask'

export function initMask() {
  const elements = document.querySelectorAll<HTMLInputElement>('[data-mask]')

  if (elements.length) {
    elements.forEach((element) => {
      const inputmaskInstance = new Inputmask('+7 (999) 999 99 99', {
        showMaskOnHover: false,
      })

      inputmaskInstance.mask(element)
    })
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => initMask())
})
