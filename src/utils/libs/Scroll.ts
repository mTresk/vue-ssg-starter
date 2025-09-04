import { getHash, logger } from '@/utils/helpers'
import Menu from '@/utils/libs/Menu'

class Scroll {
  private menu

  constructor() {
    this.pageNavigationAction = this.pageNavigationAction.bind(this)
    this.menu = new Menu()
  }

  public pageNavigation() {
    document.addEventListener('click', this.pageNavigationAction)
    document.addEventListener('watcherCallback', this.pageNavigationAction)

    if (getHash()) {
      let goToHash: string | null = null

      if (document.querySelector(`#${getHash()}`)) {
        goToHash = `#${getHash()}`
      }
      else if (document.querySelector(`.${getHash()}`)) {
        goToHash = `.${getHash()}`
      }

      if (goToHash) {
        this.gotoBlock(goToHash, true, 20)
      }
    }
  }

  public scrollDirection() {
    const body = document.body
    const scrollUp = 'scroll-up'
    const scrollDown = 'scroll-down'
    let lastScroll = 0

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY

      if (currentScroll <= 0) {
        body.classList.remove(scrollUp)

        return
      }

      if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
        body.classList.remove(scrollUp)
        body.classList.add(scrollDown)
      }
      else if (currentScroll < lastScroll && body.classList.contains(scrollDown)) {
        body.classList.remove(scrollDown)
        body.classList.add(scrollUp)
      }

      lastScroll = currentScroll
    })
  }

  public digitsCounter() {
    const counters = document.querySelectorAll('[data-digits-counter]')

    if (counters.length) {
      counters.forEach((element) => {
        const el = element as HTMLElement

        el.dataset.digitsCounter = el.innerHTML
        el.innerHTML = '0'
      })
    }

    function digitsCountersInit(digitsCountersItems?: NodeListOf<Element>) {
      const digitsCounters = digitsCountersItems || document.querySelectorAll('[data-digits-counter]')

      if (digitsCounters.length) {
        digitsCounters.forEach((digitsCounter) => {
          digitsCountersAnimate(digitsCounter as HTMLElement)
        })
      }
    }

    function digitsCountersAnimate(digitsCounter: HTMLElement) {
      let startTimestamp: number | null = null

      const duration = Number.parseInt(
        digitsCounter.dataset.digitsCounterSpeed || '1000',
      )

      const startValue = Number.parseInt(
        digitsCounter.dataset.digitsCounter || '0',
      )

      const startPosition = 0

      const step = (timestamp: number) => {
        if (!startTimestamp) {
          startTimestamp = timestamp
        }

        const progress = Math.min((timestamp - startTimestamp) / duration, 1)

        digitsCounter.innerHTML = Math.floor(progress * (startPosition + startValue)).toString()

        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }

      window.requestAnimationFrame(step)
    }

    function digitsCounterAction(e: CustomEvent) {
      const entry = e.detail.entry
      const targetElement = entry.target as HTMLElement

      if (targetElement.querySelectorAll('[data-digits-counter]').length) {
        digitsCountersInit(targetElement.querySelectorAll('[data-digits-counter]'))
      }
    }

    document.addEventListener('watcherCallback', digitsCounterAction as EventListener)
  }

  private gotoBlock(targetBlock: string, noHeader: boolean = false, offsetTop: number = 0) {
    const targetBlockElement = document.querySelector<HTMLElement>(targetBlock)

    if (targetBlockElement) {
      let headerItem = ''
      let headerItemHeight = 0

      if (noHeader) {
        headerItem = 'header.header'
        const headerElement = document.querySelector<HTMLElement>(headerItem)

        if (headerElement) {
          if (!headerElement.classList.contains('header-scroll')) {
            headerElement.style.cssText = `transition-duration: 0s;`
            headerElement.classList.add('header-scroll')
            headerItemHeight = headerElement.offsetHeight
            headerElement.classList.remove('header-scroll')

            setTimeout(() => {
              headerElement.style.cssText = ``
            })
          }
          else {
            headerItemHeight = headerElement.offsetHeight
          }
        }
      }

      if (document.documentElement.classList.contains('menu-open')) {
        this.menu.menuClose()
      }

      let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY

      targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition
      targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition

      window.scrollTo({
        top: targetBlockElementPosition,
        behavior: 'smooth',
      })

      logger(`[gotoBlock]: Юхуу...едем до ${targetBlock}`)
    }
  }

  private pageNavigationAction(e: Event) {
    if (e.type === 'click') {
      const targetElement = e.target as HTMLElement

      if (targetElement.closest('[data-goto]')) {
        const gotoLink = targetElement.closest('[data-goto]') as HTMLElement
        const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : ''
        const noHeader = gotoLink.hasAttribute('data-goto-header')
        const offsetTop = gotoLink.dataset.gotoTop ? Number.parseInt(gotoLink.dataset.gotoTop) : 0

        this.gotoBlock(gotoLinkSelector, noHeader, offsetTop)

        e.preventDefault()
      }
    }
    else if (e.type === 'watcherCallback' && 'detail' in e) {
      const entry = (e as CustomEvent).detail.entry
      const targetElement = entry.target as HTMLElement

      if (targetElement.dataset.watch === 'navigator') {
        let navigatorCurrentItem: HTMLElement | null = null

        if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) {
          navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`) as HTMLElement
        }
        else if (targetElement.classList.length) {
          for (let index = 0; index < targetElement.classList.length; index++) {
            const element = targetElement.classList[index]

            if (document.querySelector(`[data-goto=".${element}"]`)) {
              navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`) as HTMLElement

              break
            }
          }
        }

        if (entry.isIntersecting) {
          if (navigatorCurrentItem) {
            navigatorCurrentItem.classList.add('navigator-active')
          }
        }
        else {
          if (navigatorCurrentItem) {
            navigatorCurrentItem.classList.remove('navigator-active')
          }
        }
      }
    }
  }
}

export default Scroll
