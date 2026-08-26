import InputmaskLib from 'inputmask'

type InputmaskConstructor = typeof InputmaskLib

const Inputmask = (
  (InputmaskLib as unknown as { default?: InputmaskConstructor }).default
  ?? InputmaskLib
) as InputmaskConstructor

export function initMask() {
  const elements = document.querySelectorAll<HTMLInputElement>('[data-mask]')

  if (!elements.length) {
    return
  }

  elements.forEach((element) => {
    const inputmaskInstance = new Inputmask('+7 (999) 999 99 99', {
      showMaskOnHover: false,
    })

    inputmaskInstance.mask(element)
  })
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => initMask())
})
