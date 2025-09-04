import * as noUiSlider from 'nouislider'
import '@/styles/libs/nouislider.scss'

interface HTMLElementWithNoUiSlider extends HTMLElement {
  noUiSlider: noUiSlider.API
}

function initRangeSlider() {
  const elements = document.querySelectorAll<HTMLElement>('[data-range]')

  if (!elements.length) {
    return
  }

  elements.forEach((element) => {
    const sliderElement = element.querySelector('[data-range-slider]') as HTMLElementWithNoUiSlider
    const min = sliderElement.getAttribute('data-range-slider-min') || '0'
    const max = sliderElement.getAttribute('data-range-slider-max') || '100'

    noUiSlider.create(sliderElement, {
      start: [Number(min), Number(max)],
      connect: true,
      range: {
        min: Number(min),
        max: Number(max),
      },
    })

    const rangeStart = element.querySelector<HTMLInputElement>('[data-range-min]')
    const rangeEnd = element.querySelector<HTMLInputElement>('[data-range-max]')

    if (!rangeStart || !rangeEnd) {
      return
    }

    rangeStart.value = min
    rangeEnd.value = max

    function setrangeValues() {
      if (!rangeStart || !rangeEnd) {
        return
      }

      let rangeStartValue: number | null = null
      let rangeEndValue: number | null = null

      if (rangeStart.value !== '') {
        rangeStartValue = Number(rangeStart.value)
      }

      if (rangeEnd.value !== '') {
        rangeEndValue = Number(rangeEnd.value)
      }

      sliderElement.noUiSlider.set([rangeStartValue, rangeEndValue])
    }

    function setValue() {
      if (!rangeStart || !rangeEnd) {
        return
      }

      const sliderValueNumber = sliderElement.noUiSlider.get(true) as number[]
      const startValue = sliderValueNumber[0]
      const endValue = sliderValueNumber[1]

      if (startValue !== undefined && endValue !== undefined) {
        rangeStart.value = Math.round(startValue).toString()
        rangeEnd.value = Math.round(endValue).toString()
      }
    }

    rangeStart.addEventListener('change', setrangeValues)
    rangeEnd.addEventListener('change', setrangeValues)
    sliderElement.noUiSlider.on('slide', setValue)
  })
}

window.addEventListener('DOMContentLoaded', () => {
  initRangeSlider()
})
