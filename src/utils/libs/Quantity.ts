export default class Quantity {
  private selectors = {
    plus: '[data-quantity-plus]',
    minus: '[data-quantity-minus]',
    wrapper: '[data-quantity]',
    value: '[data-quantity-value]',
  }

  constructor() {
    this.init()
  }

  private init() {
    document.addEventListener('click', (e: MouseEvent) => {
      const targetElement = e.target as HTMLElement

      if (targetElement?.closest(this.selectors.plus) || targetElement?.closest(this.selectors.minus)) {
        const quantityWrapper = targetElement.closest(this.selectors.wrapper)
        const valueElement = quantityWrapper?.querySelector<HTMLInputElement>(this.selectors.value)

        if (!valueElement) {
          return
        }

        let value = Number.parseInt(valueElement.value, 10)

        if (targetElement.closest(this.selectors.plus)) {
          value++

          if (valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) {
            value = +valueElement.dataset.quantityMax
          }
        }
        else {
          --value

          if (valueElement.dataset.quantityMin) {
            if (+valueElement.dataset.quantityMin > value) {
              value = +valueElement.dataset.quantityMin
            }
          }
          else if (value < 1) {
            value = 1
          }
        }

        valueElement.value = value.toString()
      }
    })
  }
}
