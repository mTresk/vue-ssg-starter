import Inputmask from 'inputmask'

export function inputmaskInit() {
  const selectors = document.querySelectorAll<HTMLInputElement>('[data-mask]')

  if (selectors.length) {
    selectors.forEach((selector) => {
      const inputmaskInstance = new Inputmask('+7 (999) 999 99 99', {
        showMaskOnHover: false,
      })
      inputmaskInstance.mask(selector)
    })
  }
}

window.addEventListener('DOMContentLoaded', () => {
  inputmaskInit()
})
