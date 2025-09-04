import * as noUiSlider from 'nouislider'
import '@/styles/libs/nouislider.scss'

interface HTMLElementWithNoUiSlider extends HTMLElement {
  noUiSlider: noUiSlider.API
}

export function rangeInit() {
  const priceSlider = document.querySelector<HTMLElement>(
    '[data-range-slider]',
  )

  if (!priceSlider) {
    return
  }

  const from = priceSlider.getAttribute('data-range-slider-from') || '0'
  const to = priceSlider.getAttribute('data-range-slider-to') || '100'

  noUiSlider.create(priceSlider as HTMLElementWithNoUiSlider, {
    start: [Number(from), Number(to)],
    connect: true,
    range: {
      min: Number(from),
      max: Number(to),
    },
  })

  const priceStart = document.querySelector<HTMLInputElement>(
    '[data-range-slider-min]',
  )
  const priceEnd = document.querySelector<HTMLInputElement>(
    '[data-range-slider-max]',
  )

  if (!priceStart || !priceEnd) {
    return
  }

  priceStart.value = from
  priceEnd.value = to

  const typedSlider = priceSlider as HTMLElementWithNoUiSlider

  function setPriceValues() {
    if (!priceStart || !priceEnd) {
      return
    }

    let priceStartValue: number | null = null
    let priceEndValue: number | null = null

    if (priceStart.value !== '') {
      priceStartValue = Number(priceStart.value)
    }
    if (priceEnd.value !== '') {
      priceEndValue = Number(priceEnd.value)
    }
    typedSlider.noUiSlider.set([priceStartValue, priceEndValue])
  }

  function setValue() {
    if (!priceStart || !priceEnd) {
      return
    }

    const sliderValueNumber = typedSlider.noUiSlider.get(true) as number[]
    const startValue = sliderValueNumber[0]
    const endValue = sliderValueNumber[1]

    if (startValue !== undefined && endValue !== undefined) {
      priceStart.value = Math.round(startValue).toString()
      priceEnd.value = Math.round(endValue).toString()
    }
  }

  priceStart.addEventListener('change', setPriceValues)
  priceEnd.addEventListener('change', setPriceValues)
  typedSlider.noUiSlider.on('slide', setValue)
}

document.addEventListener('DOMContentLoaded', () => {
  rangeInit()
})
