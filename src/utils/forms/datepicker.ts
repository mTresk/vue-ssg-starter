import datepicker from 'js-datepicker'

function initDatepicker() {
  const elements = document.querySelectorAll<HTMLElement>('[data-datepicker]')

  if (elements.length) {
    elements.forEach((element) => {
      datepicker(element, {
        customDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        customMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        overlayButton: 'Применить',
        overlayPlaceholder: 'Год (4 цифры)',
        startDay: 1,
        formatter: (input, date) => {
          const value = date.toLocaleDateString()
          input.value = value
        },
      })
    })
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initDatepicker()
})
